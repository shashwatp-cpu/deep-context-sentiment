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
