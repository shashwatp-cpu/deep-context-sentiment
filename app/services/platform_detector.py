from urllib.parse import urlparse
from app.models.schemas import Platform


class PlatformDetector:
    @staticmethod
    def detect_platform(url: str) -> Platform:
        """Detect social media platform from URL."""
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()
        
        # YouTube
        if any(d in domain for d in ["youtube.com", "youtu.be"]):
            return Platform.YOUTUBE
        
        # Facebook
        elif any(d in domain for d in ["facebook.com", "fb.com"]):
            return Platform.FACEBOOK
        
        # Twitter/X
        elif any(d in domain for d in ["twitter.com", "x.com"]):
            return Platform.TWITTER
        
        # Instagram
        elif "instagram.com" in domain:
            return Platform.INSTAGRAM
            
        raise ValueError(f"Unsupported platform: {domain}")

    @staticmethod
    def detect_from_data(data: dict) -> Platform:
        """Detect platform from data structure fields."""
        # YouTube structure
        if "comment" in data and "author" in data:
            return Platform.YOUTUBE
        
        # Facebook structure
        elif "text" in data and "commentUrl" in data:
            return Platform.FACEBOOK
        
        # Instagram structure
        elif "text" in data and "username" in data:
            return Platform.INSTAGRAM
        
        # Twitter structure
        elif "text" in data and "conversation_id" in data:
            return Platform.TWITTER
            
        raise ValueError("Unable to determine platform from data structure")