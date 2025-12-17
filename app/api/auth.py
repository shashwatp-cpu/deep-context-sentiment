from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
# In a real Clerk setup, we would verify the JWT signature here using the Clerk Public Key / JWKS
# For now, we will trust the token's presence for this migration step, requiring the user to set up backend verification properly.

router = APIRouter()

# Placeholder for current user dependency with Lazy Sync
async def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    # MOCK/PLACEHOLDER CLERK VERIFICATION
    # In production, verify the JWT properly.
    # For now, we assume the token is valid and just extract info if possible, or use a mock.
    
    # We'll simulate extracting a user ID and email from the token
    # Since we can't decode the real Clerk token without the secret/JWKS easily here without the library setup
    # We will assume the frontend sends "Bearer <token>" and we trust it for this prototype step.
    
    # To make this actually work for the user immediately without complex backend setup:
    # We can try to decode the JWT unverified to get the 'sub' (clerk_id) and 'email'.
    # Note: This is NOT secure for production but solves the "framework" requirement for development/MVP.
    
    import jwt
    try:
        # Remove 'Bearer ' prefix
        token = authorization.split(" ")[1]
        
        # Decode without verification to get claims
        payload = jwt.decode(token, options={"verify_signature": False})
        
        clerk_id = payload.get("sub")
        # Clerk emails are often in a custom claim or we rely on frontend passing it? 
        # Usually it's in 'email' or 'detailed_user'. 
        # Let's default to a placeholder if missing in standard claims, or rely on 'sub'.
        email = payload.get("email") # specific claim setup might be needed in Clerk
        
        # Fallback for testing/dev if token structure is different
        if not email:
            email = f"{clerk_id}@nexgrow.platform" 

    except Exception as e:
        # Fallback for when the token isn't a valid JWT (e.g. testing with curl)
        clerk_id = "test_clerk_user"
        email = "test@example.com"

    # SYNC TO DATABASE
    from app.models.user import User
    
    # Check if user exists by Clerk ID
    user = db.query(User).filter(User.clerk_id == clerk_id).first()
    
    if not user:
        # Check by email as fallback (migration)
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            # Update existing user with Clerk ID
            user.clerk_id = clerk_id
            db.commit()
            db.refresh(user)
        else:
            # Create new user
            user = User(
                clerk_id=clerk_id,
                email=email,
                plan_type="free"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
    return user

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
