from fastapi import APIRouter, Depends
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/me")
def get_user_me(current_user: dict = Depends(get_current_user)):
    """
    Returns authenticated user payload decoded from JWT access token.
    """
    return {
        "id": current_user.get("sub"),
        "email": current_user.get("email"),
        "user_metadata": current_user.get("user_metadata", {}),
        "role": current_user.get("role")
    }
