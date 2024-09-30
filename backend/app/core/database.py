import asyncio
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_scoped_session,
    async_sessionmaker,
)
from wireup import service

from config.settings import Settings


@service
class Database:
    def __init__(self, settings: Settings) -> None:
        self._engine = create_async_engine(settings.secrets.POSTGRES_URI, echo=True)
        self._session_factory = async_scoped_session(
            async_sessionmaker(
                autocommit=False,
                expire_on_commit=False,
                autoflush=False,
                bind=self._engine,
            ),
            scopefunc=asyncio.current_task,
        )

    @asynccontextmanager
    async def produce_session(self) -> AsyncGenerator[
        AsyncSession,
        None
    ]:
        session: AsyncSession = self._session_factory()
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logging.error(f"Session rollback due to exception: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database error",
            )
        finally:
            await session.close()