from fastapi import APIRouter

from .auth import router as auth_router
from .device import router as device_router
from .user import router as user_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(device_router, prefix="/devices", tags=["devices"])
router.include_router(user_router, prefix="/users", tags=["users"])
