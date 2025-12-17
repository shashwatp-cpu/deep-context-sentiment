import json
import logging
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

from app.models.schemas import PostContext, CleanedComment, CommentSentiment

class AIAgentLogger:
    def __init__(self):
        # Determine logs directory
        import os
        # Check if we are in a read-only environment (like Vercel)
        # We can try to write to 'logs', if it fails, fallback to '/tmp'
        try:
            self.logs_dir = Path("logs/ai_agent")
            self.logs_dir.mkdir(parents=True, exist_ok=True)
            # Test write permission
            test_file = self.logs_dir / ".test"
            test_file.touch()
            test_file.unlink()
        except (OSError, PermissionError):
            # Fallback to /tmp for serverless environments
            self.logs_dir = Path("/tmp/logs/ai_agent")
            self.logs_dir.mkdir(parents=True, exist_ok=True)
        
        # Set up logging
        self.logger = logging.getLogger("ai_agent")
        self.logger.setLevel(logging.INFO)
        
    def _create_log_file(self, platform: str, post_id: str) -> Path:
        """Create a new log file with timestamp."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{platform}_{post_id}_{timestamp}.log"
        return self.logs_dir / filename
        
    def _extract_post_id(self, url: str) -> str:
        """Extract post ID from URL."""
        return url.split("/")[-1][:10]  # Take last part of URL and first 10 chars
        
    def log_analysis_session(
        self,
        url: str,
        post_context: PostContext,
        comment_batch: List[CleanedComment],
        sentiments: List[CommentSentiment],
        prompt: str,
        processing_time: float
    ) -> None:
        """Log a complete analysis session."""
        post_id = self._extract_post_id(url)
        log_file = self._create_log_file(post_context.platform.value, post_id)
        
        analysis_log = {
            "timestamp": datetime.now().isoformat(),
            "url": url,
            "platform": post_context.platform.value,
            "processing_time": processing_time,
            
            "context": {
                "platform": post_context.platform.value,
                "title": post_context.title,
                "description": post_context.description,
                "captions": post_context.captions,
                "text": post_context.text,
                "media": post_context.media,
                "images": post_context.images,
                "alt": post_context.alt,
                "caption": post_context.caption
            },
            
            "prompt": prompt,
            
            "comments": [
                {
                    "original_comment": comment.comment,
                    "platform": comment.platform,
                    "timestamp": comment.timestamp
                }
                for comment in comment_batch
            ],
            
            "analysis_results": [
                {
                    "comment": sentiment.Comment,
                    "sentiment": sentiment.Sentiment,
                    "justification": sentiment.Justification
                }
                for sentiment in sentiments
            ]
        }
        
        # Write log to file
        with open(log_file, "w", encoding="utf-8") as f:
            json.dump(analysis_log, f, indent=2, ensure_ascii=False)
            
        self.logger.info(f"Analysis log saved to {log_file}")
        
    def get_latest_logs(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieve the most recent analysis logs."""
        log_files = sorted(
            self.logs_dir.glob("*.log"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )[:limit]
        
        logs = []
        for log_file in log_files:
            try:
                with open(log_file, "r", encoding="utf-8") as f:
                    logs.append(json.load(f))
            except Exception as e:
                self.logger.error(f"Error reading log file {log_file}: {e}")
                
        return logs