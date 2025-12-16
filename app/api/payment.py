import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.config import settings
from pydantic import BaseModel
import hmac
import hashlib

router = APIRouter()

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class OrderCreate(BaseModel):
    amount: int # in cents/paise
    currency: str = "USD"
    plan_name: str # basic_1 or pro_5

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan_name: str

@router.post("/orders")
async def create_order(order: OrderCreate, current_user: User = Depends(get_current_user)):
    data = { "amount": order.amount * 100, "currency": order.currency, "payment_capture": 1 } # Razorpay expects amount in smallest currency unit
    try:
        payment_order = client.order.create(data=data)
        return payment_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
async def verify_payment(payment: PaymentVerify, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify signature
    params_dict = {
        'razorpay_order_id': payment.razorpay_order_id,
        'razorpay_payment_id': payment.razorpay_payment_id,
        'razorpay_signature': payment.razorpay_signature
    }
    
    # client.utility.verify_payment_signature(params_dict) # This method sometimes throws hard errors, manual verification is safer if library version issues occur
    
    msg = f"{payment.razorpay_order_id}|{payment.razorpay_payment_id}"
    generated_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        msg.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if generated_signature == payment.razorpay_signature:
        # Update user plan
        current_user.plan_type = payment.plan_name
        # current_user.subscription_end_date = ... # Handle logic for 1 month
        db.commit()
        return {"status": "success", "message": "Payment verified and plan updated"}
    else:
        raise HTTPException(status_code=400, detail="Invalid signature")
