import re
from typing import List, Optional
from app.models.schemas import Platform, CleanedComment


class CommentCleaner:
    URL_PATTERN = re.compile(r'https?://[^\s]+')
    WHITESPACE_PATTERN = re.compile(r'\s+')

    @staticmethod
    def extract_comment_text(data: dict, platform: Platform) -> Optional[str]:
        """Extract comment text based on platform-specific data structure."""
        if platform == Platform.YOUTUBE:
            return data.get("comment")
        elif platform in [Platform.FACEBOOK, Platform.TWITTER, Platform.INSTAGRAM]:
            return data.get("text")
        
        # Fallback checks
        for field in ["comment", "text", "content", "message"]:
            if field in data and isinstance(data[field], str):
                return data[field]
        return None

    @staticmethod
    def clean_text(text: str) -> str:
        """Clean text by removing URLs and normalizing whitespace."""
        # Remove URLs
        text = CommentCleaner.URL_PATTERN.sub('', text)
        
        # Normalize whitespace
        text = CommentCleaner.WHITESPACE_PATTERN.sub(' ', text)
        
        # Strip leading/trailing whitespace
        return text.strip()

    @staticmethod
    def is_valid_comment(text: str, min_length: int = 3) -> bool:
        """Check if comment text is valid and meets minimum length."""
        if not text or not isinstance(text, str):
            return False
        return len(text.strip()) >= min_length

    @staticmethod
    def process_comments(items: List[dict], platform: Platform) -> List[CleanedComment]:
        """Process raw comments into cleaned, validated comments."""
        cleaned_comments = []
        
        for idx, item in enumerate(items):
            # Extract comment text
            text = CommentCleaner.extract_comment_text(item, platform)
            if not text:
                continue
                
            # Clean and validate text
            cleaned_text = CommentCleaner.clean_text(text)
            if not CommentCleaner.is_valid_comment(cleaned_text):
                continue
            
            # Extract timestamp
            timestamp = (
                item.get("date") or 
                item.get("publishedTimeText") or 
                item.get("created_at")
            )
            
            # Create cleaned comment
            comment = CleanedComment(
                comment=cleaned_text,
                platform=platform.value,
                originalIndex=idx,
                timestamp=timestamp
            )
            cleaned_comments.append(comment)
            
        return cleaned_comments

    @staticmethod
    def aggregate_comments(comments: List[CleanedComment]) -> str:
        """Join comment texts for batch processing."""
        return ", ".join(comment.comment for comment in comments)

    @staticmethod
    def chunk_comments(comments: List[CleanedComment], batch_size: int) -> List[List[CleanedComment]]:
        """Split comments into batches."""
        return [
            comments[i:i + batch_size] 
            for i in range(0, len(comments), batch_size)
        ]
