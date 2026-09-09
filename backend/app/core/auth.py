from typing import Optional
import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

security = HTTPBearer(auto_error=False)

DEFAULT_DEV_USER = {
    "sub": "demo-user-123",
    "email": "demo@speknova.com",
    "role": "authenticated",
    "user_metadata": {
        "full_name": "Demo User"
    }
}

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> dict:
    """
    Dependency to validate JWT tokens sent in authorization header.
    If SUPABASE_JWT_SECRET is set, we strictly verify signature and algorithm.
    Otherwise, we bypass verification to allow local development/testing.
    """
    if not credentials:
        if settings.SUPABASE_JWT_SECRET:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization credentials required",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return DEFAULT_DEV_USER

    token = credentials.credentials
    try:
        if settings.SUPABASE_JWT_SECRET:
            # Decode using Supabase JWT Secret (standard HS256)
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            return payload
        else:
            # Local dev mode fallback - try decoding without signature verification
            try:
                payload = jwt.decode(token, options={"verify_signature": False})
                return payload
            except Exception:
                # Token is a dev placeholder string (e.g. "demo-session-token")
                return DEFAULT_DEV_USER
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
