from typing import Optional, List
from uuid import UUID

from sqlalchemy.future import select
from wireup import service

from app.api.v1.schemas.field import FieldCreate, FieldUpdate
from app.core.database import Database
from app.models.crop_report import CropReport
from app.models.device import Device
from app.models.field import FieldModel
from app.models.user import User
from app.repositories.abstract.base import BaseRepository


@service
class FieldRepository(BaseRepository[FieldModel, FieldCreate, FieldUpdate]):
    def __init__(self, database: Database):
        super().__init__(database, FieldModel)  # type: ignore

    async def get_field_by_device_id(self, device_id: UUID) -> Optional[FieldModel]:
        async with self.produce_session() as session:
            stmt = select(FieldModel).join(Device, FieldModel.devices).where(Device.id == device_id)  # type: ignore
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def get_field_by_district_id(self, district_id: UUID) -> List[FieldModel]:
        async with self.produce_session() as session:
            stmt = select(FieldModel).where(FieldModel.district_id == district_id)  # type: ignore
            result = await session.execute(stmt)
            return result.scalars().all()

    async def get_field_by_crop_report_id(self, crop_report_id: UUID) -> Optional[FieldModel]:
        async with (self.produce_session() as session):
            stmt = (select(FieldModel).join(CropReport, FieldModel.crop_reports)  # type: ignore
                    .where(CropReport.id == crop_report_id))
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def get_field_by_user_id(self, user_id: UUID) -> List[FieldModel]:
        async with self.produce_session() as session:
            stmt = (
                select(FieldModel)
                .join(Device, Device.field_id == FieldModel.id)  # type: ignore
                .join(User, User.id == Device.user_id)
                .where(User.id == user_id)
            )
            result = await session.execute(stmt)
            fields = result.scalars().all()
            return fields
