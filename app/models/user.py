from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.models.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Subscription fields
    plan_type = Column(String, default="free") # free, basic_1, pro_5
    subscription_end_date = Column(DateTime, nullable=True)
    razorpay_customer_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Usage Tracking
    request_count = Column(Integer, default=0)
    last_request_date = Column(DateTime, nullable=True)
