import time
import structlog
import google.generativeai as genai
from typing import List, Dict
from collections import defaultdict
from datetime import datetime

from app.config import settings
from app.models.schemas import (
    PostContext,
    CleanedComment,
    CommentSentiment,
    BatchResult,
    AnalysisResponse,
    Platform,
    SentimentSummary,
    SentimentCategory
)
from app.utils.comment_cleaner import CommentCleaner
from app.utils.ai_agent_logger import AIAgentLogger

logger = structlog.get_logger()

class SentimentService:
    SYSTEM_PROMPT = """
    You are an advanced contextual sentiment analysis agent.
    Analyze comments in relation to the original post context.

    ALLOWED SENTIMENTS (exactly 6):
    1. Supportive/Empathetic - sympathy, encouragement, compassion
    2. Critical/Disapproving - disapproval, dissatisfaction, negative judgment
    3. Sarcastic/Ironic - irony, sarcasm, mockery
    4. Informative/Neutral - factual statements, neutral observations
    5. Appreciative/Praising - admiration, gratitude, approval
    6. Angry/Hostile - frustration, outrage, aggressive criticism

    OUTPUT RULES:
    - JSON array format only
    - Each object: {Comment: str, Sentiment: str, Justification: str}
    - Sentiment must be one of the 6 categories exactly
    - Justification explains reasoning based on post context

    ANALYSIS DIMENSIONS:
    - Emotional tone within the 6 categories
    - Subjectivity vs objectivity
    - Intensity (mild, moderate, strong)
    - Contextual alignment with post
    - Detect sarcasm/irony
    - User intent (support, criticize, inform)
    """

    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self.ai_logger = AIAgentLogger()

    def _build_batch_prompt(self, post_context: PostContext, comment_batch: List[CleanedComment]) -> str:
        """Build prompt with post context and comments."""
        context_section = ""
        
        if post_context.platform == Platform.YOUTUBE:
            context_section = (
                f"Title: {post_context.title}\n"
                f"Description: {post_context.description}\n"
                f"Captions: {post_context.captions}"
            )
        elif post_context.platform == Platform.FACEBOOK:
            media_info = post_context.media[0] if post_context.media else {}
            context_section = (
                f"Post Text: {post_context.text}\n"
                f"Post Image: {media_info.get('thumbnail', '')}\n"
                f"OCR: {media_info.get('ocrText', '')}"
            )
        elif post_context.platform == Platform.TWITTER:
            context_section = (
                f"Text: {post_context.text}\n"
                f"Image URL: {post_context.media}"
            )
        elif post_context.platform == Platform.INSTAGRAM:
            context_section = (
                f"Images: {post_context.images}\n"
                f"Alt: {post_context.alt}\n"
                f"Captions: {post_context.caption}"
            )
        
        comments_str = CommentCleaner.aggregate_comments(comment_batch)
        
        return (
            f"{context_section}\n\n"
            f"Comments to analyze:\n{comments_str}\n\n"
            "Analyze each comment and return a JSON array of results."
        )

    def _parse_json_response(self, text: str) -> List[CommentSentiment]:
        """Parse Gemini response into CommentSentiment objects."""
        import json
        import re
        
        # Try to extract JSON from markdown code block
        json_match = re.search(r'```json\n([\s\S]*?)\n```', text)
        if not json_match:
            # Try to find raw JSON array
            json_match = re.search(r'\[\s*\{[\s\S]*\}\s*\]', text)
            if not json_match:
                raise ValueError("No JSON found in response")
                
        # Clean the JSON text
        json_str = json_match.group(1) if json_match.groups() else json_match.group(0)
        json_str = json_str.replace('"', '"').replace('"', '"')  # Fix smart quotes
        json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)  # Remove control chars
        
        try:
            data = json.loads(json_str)
            # Handle single dict or array
            items = [data] if isinstance(data, dict) else data
            return [CommentSentiment(**item) for item in items]
        except Exception as e:
            logger.error("json_parse_error",
                        error=str(e),
                        text=text[:200] + "...")
            raise

    async def analyze_batch_with_gemini(
        self,
        post_context: PostContext,
        comment_batch: List[CleanedComment],
        batch_number: int,
        url: str = None  # Added URL parameter for logging
    ) -> BatchResult:
        """Analyze a batch of comments using Gemini."""
        start_time = time.time()
        
        try:
            # Build and send prompt
            prompt = self._build_batch_prompt(post_context, comment_batch)
            full_prompt = f"{self.SYSTEM_PROMPT}\n\n{prompt}"
            
            response = self.gemini_model.generate_content(full_prompt)
            
            # Parse response
            sentiments = self._parse_json_response(response.text)
            processing_time = time.time() - start_time
            
            # Log the analysis session
            if url:
                self.ai_logger.log_analysis_session(
                    url=url,
                    post_context=post_context,
                    comment_batch=comment_batch,
                    sentiments=sentiments,
                    prompt=full_prompt,
                    processing_time=processing_time
                )
            
            logger.info("batch_analysis_complete",
                       batch_number=batch_number,
                       comments_analyzed=len(sentiments),
                       processing_time=processing_time)
                       
            return BatchResult(
                batchNumber=batch_number,
                sentiments=sentiments,
                processingTime=processing_time
            )
            
        except Exception as e:
            logger.error("batch_analysis_error",
                        batch_number=batch_number,
                        error=str(e))
            return BatchResult(
                batchNumber=batch_number,
                sentiments=[],
                processingTime=time.time() - start_time,
                error=str(e)
            )

    def create_summary_response(
        self,
        post_url: str,
        platform: Platform,
        post_context: PostContext,
        sentiments: List[CommentSentiment],
        processing_time: float,
        batches_count: int
    ) -> AnalysisResponse:
        """Create final analysis response with summaries."""
        # Group comments by sentiment
        grouped: Dict[str, List[str]] = defaultdict(list)
        for sentiment in sentiments:
            grouped[sentiment.Sentiment].append(sentiment.Comment)
            
        # Calculate summary counts
        total_comments = len(sentiments)
        summary = SentimentSummary(
            totalComments=total_comments,
            supportive_empathetic=len(grouped[SentimentCategory.SUPPORTIVE_EMPATHETIC]),
            critical_disapproving=len(grouped[SentimentCategory.CRITICAL_DISAPPROVING]),
            angry_hostile=len(grouped[SentimentCategory.ANGRY_HOSTILE]),
            sarcastic_ironic=len(grouped[SentimentCategory.SARCASTIC_IRONIC]),
            informative_neutral=len(grouped[SentimentCategory.INFORMATIVE_NEUTRAL]),
            appreciative_praising=len(grouped[SentimentCategory.APPRECIATIVE_PRAISING])
        )
        
        # Create top and all comments dicts
        top_comments = {
            category: comments[:10]
            for category, comments in grouped.items()
        }
        
        all_comments = {
            category: comments
            for category, comments in grouped.items()
        }
        
        return AnalysisResponse(
            status="completed",
            timestamp=datetime.now(),
            postUrl=post_url,
            platform=platform,
            postContext=post_context,
            summary=summary,
            topComments=top_comments,
            allComments=all_comments,
            processingTime=processing_time,
            batchesProcessed=batches_count
        )