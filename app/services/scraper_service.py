import platform
import httpx
import structlog
from typing import List, Tuple, Dict
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.models.schemas import Platform, PostContext, CleanedComment
from app.utils.comment_cleaner import CommentCleaner

logger = structlog.get_logger()

class ScraperService:
    def __init__(self):
        self.base_url = "https://api.apify.com/v2/acts"
        self.token = settings.APIFY_API_TOKEN
        self.timeout = settings.REQUEST_TIMEOUT

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=4, max=10))
    async def _make_apify_request(self, actor_id: str, payload: dict) -> List[dict]:
        """Make request to Apify API with retries."""
        url = f"{self.base_url}/{actor_id}/run-sync-get-dataset-items"
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                url,
                params={"token": self.token},
                json=payload
            )
            response.raise_for_status()
            return response.json()

    async def scrape_youtube(self, url: str) -> Tuple[PostContext, List[CleanedComment]]:
        """Scrape YouTube video info and comments."""
        # Get video info and transcripts
        transcript_data = await self._make_apify_request(
            "karamelo~youtube-transcripts",
            {
                "urls": [url],
                "descriptionBoolean": True,
                "channelNameBoolean": True
            }
        )

        # Get comments
        comment_data = await self._make_apify_request(
            "streamers~youtube-comments-scraper",
            {
                "commentsSortBy": "0",
                "maxComments": settings.YOUTUBE_MAX_COMMENTS,
                "startUrls": [{"url": url, "method": "GET"}]
            }
        )

        # Create post context
        video_info = transcript_data[0] if transcript_data else {}
        post_context = PostContext(
            platform=Platform.YOUTUBE,
            title=video_info.get("title"),
            description=video_info.get("description"),
            captions=video_info.get("transcript", "")
        )

        # Process comments
        cleaned_comments = CommentCleaner.process_comments(
            comment_data, Platform.YOUTUBE
        )

        return post_context, cleaned_comments

    async def scrape_facebook(self, url: str) -> Tuple[PostContext, List[CleanedComment]]:
        """Scrape Facebook post info and comments."""
        # Get post info
        post_data = await self._make_apify_request(
            "apify~facebook-posts-scraper",
            {
                "captionText": True,
                "resultsLimit": 20,
                "startUrls": [{"url": url}]
            }
        )

        # Get comments
        comment_data = await self._make_apify_request(
            "apify~facebook-comments-scraper",
            {
                "includeNestedComments": False,
                "resultsLimit": settings.FACEBOOK_MAX_COMMENTS,
                "startUrls": [{"url": url}]
            }
        )

        # Create post context
        post_info = post_data[0] if post_data else {}
        post_context = PostContext(
            platform=Platform.FACEBOOK,
            text=post_info.get("text"),
            media=post_info.get("media", [])
        )

        # Process comments
        cleaned_comments = CommentCleaner.process_comments(
            comment_data, Platform.FACEBOOK
        )

        return post_context, cleaned_comments

    async def scrape_twitter(self, url: str) -> Tuple[PostContext, List[CleanedComment]]:
        """Scrape Twitter/X post info and replies."""
        # Get tweet info
        post_data = await self._make_apify_request(
            "apidojo~twitter-scraper-lite",
            {
                "maxItems": 1,
                "startUrls": [url]
            }
        )

        # Get post ID and replies
        post = post_data[0] if post_data and isinstance(post_data[0], dict) else {}
        post_id = post.get("id")

        # If we can't get an ID, we can't get replies, so we exit.
        if not post_id:
            return PostContext(platform=Platform.TWITTER, text=post.get("fullText")), []
        reply_data = await self._make_apify_request(
            "kaitoeasyapi~twitter-reply",
            {   "conversation_ids": [post_id], 
                "max_items_per_conversation": settings.TWITTER_MAX_ITEMS
            }
            )
        main_tweet_details = reply_data[0] if reply_data and isinstance(reply_data[0], dict) else post
        comments_only = reply_data[1:] if len(reply_data) > 1 else []

        # Create post context from the detailed main tweet data
        post_context = PostContext(
            platform=Platform.TWITTER,
            text=main_tweet_details.get("fullText") or main_tweet_details.get("text"),
            media=main_tweet_details.get("media", [])
        )

        # Process ONLY the comments
        cleaned_comments = CommentCleaner.process_comments(
            comments_only, Platform.TWITTER
        )

        return post_context, cleaned_comments

    async def scrape_instagram(self, url: str) -> Tuple[PostContext, List[CleanedComment]]:
        """Scrape Instagram Reel/Post info and comments."""
        # Get post info using the reel scraper
        # Using 'apify/instagram-reel-scraper' as requested
        post_data = await self._make_apify_request(
            "apify~instagram-reel-scraper",
            {
                "username": [url],
                "includeTranscript": True,
                "resultsLimit": 1,
                "includeDownloadedVideo": False,
                "includeSharesCount": False,
                "skipPinnedPosts": False
            }
        )

        # Get comments
        # We'll continue using the general instagram-scraper for comments as it's reliable for that
        # or check if we should switch. The user said "replace the instagram scraper with this"
        # but likely meant for the main content to get transcripts.
        # "apify/instagram-reel-scraper" focuses on reels data.
        # Let's keep the comment scraping separately using the generic scraper unless we know the reel scraper captures them well.
        # Actually, let's try to get comments from the same scraper if possible, but usually they are separate or nested.
        # For safety and minimal breakage, I will keep the comment fetching as is (using apify~instagram-scraper in comments mode)
        # UNLESS the user explicitly meant replace EVERYTHING. 
        # "replace the instagram scraper with this" implied the tool used for scraping the content.
        # I will keep the comment scraper as is for now to ensure we still get comments, 
        # as reel scrapers often just get the video data.
        
        comment_data = await self._make_apify_request(
            "apify~instagram-scraper",
            {
                "directUrls": [url],
                "resultsType": "comments",
                "resultsLimit": settings.INSTAGRAM_MAX_COMMENTS
            }
        )

        # Create post context
        post_info = post_data[0] if post_data else {}
        
        # Extract images from displayUrl
        images = []
        if post_info.get("displayUrl"):
            images.append(post_info.get("displayUrl"))
        
        # Extract transcript if available
        # User specified "transcript" key in the JSON
        transcripts = post_info.get("transcript", "")
        
        # Also check for "captions" just in case, or combine
        if not transcripts and post_info.get("captions"):
             if isinstance(post_info["captions"], list):
                transcripts = " ".join(str(c) for c in post_info["captions"])
             else:
                transcripts = str(post_info["captions"])

        post_context = PostContext(
            platform=Platform.INSTAGRAM,
            images=images,
            alt=post_info.get("alt"), # Keep for backward compat if fields exist
            caption=post_info.get("caption"), # Main post text
            captions=transcripts # Video transcript
        )

        # Process comments
        cleaned_comments = CommentCleaner.process_comments(
            comment_data, Platform.INSTAGRAM
        )

        return post_context, cleaned_comments

    async def scrape_platform(self, url: str, platform: Platform) -> Tuple[PostContext, List[CleanedComment]]:
        """Route scraping to appropriate platform handler."""
        logger.info("starting_scrape", platform=platform.value, url=url)

        scraper_map = {
            Platform.YOUTUBE: self.scrape_youtube,
            Platform.FACEBOOK: self.scrape_facebook,
            Platform.TWITTER: self.scrape_twitter,
            Platform.INSTAGRAM: self.scrape_instagram
        }

        scraper = scraper_map.get(platform)
        if not scraper:
            raise ValueError(f"Unsupported platform: {platform}")

        post_context, comments = await scraper(url)
        
        logger.info("scraping_complete",
                   platform=platform.value,
                   url=url,
                   comments_count=len(comments))
                   
        return post_context, comments