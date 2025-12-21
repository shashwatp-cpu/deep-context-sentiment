from fastapi import APIRouter, Depends, HTTPException, status, Header
# In a real Clerk setup, we would verify the JWT signature here using the Clerk Public Key / JWKS
# For now, we will trust the token's presence for this migration step, requiring the user to set up backend verification properly.

router = APIRouter()

# Stateless User dependency
async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    import jwt
    try:
        # Remove 'Bearer ' prefix
        token = authorization.split(" ")[1]
        
        # Decode without verification to get claims (stateless)
        # Using PyJWT
        payload = jwt.decode(token, options={"verify_signature": False})
        
        clerk_id = payload.get("sub")
        # Try to get email from standard claims
        email = payload.get("email")
        if not email and "email_addresses" in payload:
             # Clerk sometimes puts it here
             email = payload["email_addresses"][0].get("email_address")
        
        if not email:
            email = f"{clerk_id}@nexgrow.platform" 
            
        # Return a simple object matching the expected interface
        # We Mock the User model structure using a simple class or namedtuple
        from types import SimpleNamespace
        return SimpleNamespace(
            clerk_id=clerk_id,
            email=email,
            plan_type="free", # Default to free for everyone
            request_count=0,  # Unlimited
            is_active=True
        )

    except Exception as e:
        # Fallback for when the token isn't a valid JWT
        raise HTTPException(status_code=401, detail="Invalid Authentication Token")

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "clerk_id": current_user.clerk_id,
        "email": current_user.email,
        "plan_type": current_user.plan_type
    }

async def check_and_increment_usage(user_id: str):
    """
    Check if the user has exceeded their daily limit and increment usage if not.
    Uses Clerk's private metadata to store usage stats.
    """
    from app.config import settings
    import httpx
    from datetime import datetime
    import structlog
    
    logger = structlog.get_logger()

    if not settings.CLERK_SECRET_KEY:
        logger.warning("rate_limit_skipped_no_key", user_id=user_id)
        # If no secret key is configured, skip rate limiting (e.g. dev mode)
        return

    async with httpx.AsyncClient() as client:
        # 1. Fetch current user metadata
        try:
            logger.info("fetching_clerk_user", user_id=user_id, url=f"{settings.CLERK_API_URL}/users/{user_id}")
            response = await client.get(
                f"{settings.CLERK_API_URL}/users/{user_id}",
                headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"}
            )
            if response.status_code != 200:
                logger.error("clerk_fetch_failed", status_code=response.status_code, response=response.text)
                return

            user_data = response.json()
            private_metadata = user_data.get("private_metadata", {})
            logger.info("current_metadata", metadata=private_metadata)
            
        except Exception as e:
            logger.error("clerk_fetch_error", error=str(e))
            return

        # 2. Check usage
        today_str = datetime.now().strftime("%Y-%m-%d")
        usage_data = private_metadata.get("usage", {"date": today_str, "count": 0})
        
        # Reset if new day
        if usage_data.get("date") != today_str:
            logger.info("resetting_daily_limit", old_date=usage_data.get("date"), new_date=today_str)
            usage_data = {"date": today_str, "count": 0}
            
        current_count = usage_data.get("count", 0)
        logger.info("usage_check", current_count=current_count, limit=5)
        
        # 3. Enforce limit (5 per day)
        if current_count >= 5:
            logger.warning("rate_limit_exceeded", user_id=user_id, count=current_count)
            raise HTTPException(
                status_code=429,
                detail="Daily analysis limit reached (5 requests/day). Please try again tomorrow."
            )
            
        # 4. Increment and update
        usage_data["count"] = current_count + 1
        private_metadata["usage"] = usage_data
        
        try:
            logger.info("updating_usage", new_count=usage_data["count"])
            update_resp = await client.patch(
                f"{settings.CLERK_API_URL}/users/{user_id}",
                headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
                json={"private_metadata": private_metadata}
            )
            if update_resp.status_code != 200:
                logger.error("clerk_update_failed", status_code=update_resp.status_code, response=update_resp.text)
        except Exception as e:
            logger.error("clerk_update_error", error=str(e))

