from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, HttpUrl
from datetime import datetime


class Platform(str, Enum):
    YOUTUBE = "youtube"
    FACEBOOK = "facebook"
    TWITTER = "twitter"
    INSTAGRAM = "instagram"


class SentimentCategory(str, Enum):
    SUPPORTIVE_EMPATHETIC = "Supportive/Empathetic"
    CRITICAL_DISAPPROVING = "Critical/Disapproving"
    SARCASTIC_IRONIC = "Sarcastic/Ironic"
    INFORMATIVE_NEUTRAL = "Informative/Neutral"
    APPRECIATIVE_PRAISING = "Appreciative/Praising"
    ANGRY_HOSTILE = "Angry/Hostile"


class AnalysisRequest(BaseModel):
    url: HttpUrl


class CleanedComment(BaseModel):
    comment: str
    platform: str
    originalIndex: int
    timestamp: Optional[str] = None


class CommentSentiment(BaseModel):
    Comment: str
    Sentiment: SentimentCategory
    Justification: str


class SentimentSummary(BaseModel):
    totalComments: int
    supportive_empathetic: int
    critical_disapproving: int
    angry_hostile: int
    sarcastic_ironic: int
    informative_neutral: int
    appreciative_praising: int


class PostContext(BaseModel):
    platform: Platform
    title: Optional[str] = None
    description: Optional[str] = None
    captions: Optional[str] = None
    text: Optional[str] = None
    media: Optional[List[Dict]] = None
    images: Optional[List[str]] = None
    alt: Optional[str] = None
    caption: Optional[str] = None


class BatchResult(BaseModel):
    batchNumber: int
    sentiments: List[CommentSentiment]
    processingTime: float
    error: Optional[str] = None


class AnalysisResponse(BaseModel):
    status: str = "completed"
    timestamp: datetime
    postUrl: str
    platform: Platform
    postContext: PostContext
    summary: SentimentSummary
    topComments: Dict[str, List[str]]
    allComments: Dict[str, List[str]]
    processingTime: float
    batchesProcessed: int

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    plan_type: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

