from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API Configuration
    APP_NAME: str = "Sentiment Analyzer API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # API Keys
    APIFY_API_TOKEN: str
    GOOGLE_GEMINI_API_KEY: str
    OPENAI_API_KEY: Optional[str] = None
    
    # Clerk Configuration
    CLERK_SECRET_KEY: Optional[str] = None
    CLERK_API_URL: str = "https://api.clerk.com/v1"

    # Razorpay
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None

    # Security
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    # Removed for stateless Vercel deployment
    
    # Model Configuration
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"
    OPENAI_MODEL: Optional[str] = "gpt-4"
    
    # Processing Settings
    BATCH_SIZE: int = 10
    MAX_COMMENTS: int = 100
    MAX_CONCURRENT_BATCHES: int = 5
    REQUEST_TIMEOUT: int = 300
    
    # Platform Specific Limits
    YOUTUBE_MAX_COMMENTS: int = 100
    FACEBOOK_MAX_COMMENTS: int = 100
    TWITTER_MAX_ITEMS: int = 100
    INSTAGRAM_MAX_COMMENTS: int = 100
    
    # Usage Limits
    # Removed for stateless Vercel deployment
    
    # # Optional Integrations
    # REDIS_HOST: str = "localhost"
    # REDIS_PORT: int = 6379
    # REDIS_DB: int = 0
    # REDIS_PASSWORD: Optional[str] = None
    
    # GOOGLE_SHEETS_CREDENTIALS_FILE: str = "credentials.json"
    # GOOGLE_SHEETS_SPREADSHEET_ID: Optional[str] = None
    # GOOGLE_SHEETS_SHEET_NAME: str = "Sheet1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Allow extra env vars in .env without raising error


@lru_cache()
def get_settings() -> Settings:
    """Create cached settings instance."""
    return Settings()


settings = get_settings()