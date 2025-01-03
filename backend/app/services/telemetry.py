from typing import Dict, List
from uuid import UUID

from wireup import service

from app.api.v1.schemas.telemetry import TelemetryCreate, TelemetryRead, TelemetryUpdate
from app.common.exceptions.telemetry import TelemetryNotFound
from app.repositories.telemetry import TelemetryRepository
from app.services.abstract.base import BaseService


@service
class TelemetryService(BaseService[TelemetryRepository]):
    def __init__(self, telemetry_repository: TelemetryRepository):
        super().__init__(telemetry_repository)

    async def create_telemetry(self, telemetry_data: TelemetryCreate) -> TelemetryRead:
        created_telemetry = await self.repository.create(telemetry_data)
        return TelemetryRead.model_validate(created_telemetry)

    async def get_telemetry_by_id(self, telemetry_id: UUID) -> TelemetryRead:
        telemetry = await self.repository.get(telemetry_id)
        if not telemetry:
            raise TelemetryNotFound()
        return TelemetryRead.model_validate(telemetry)

    async def get_telemetry_by_device_id(self, device_id: UUID) -> List[TelemetryRead]:
        telemetry = await self.repository.get_telemetry_by_device_id(device_id)
        if not telemetry:
            raise TelemetryNotFound()
        last_created_telemetry = max(telemetry, key=lambda t: t.created_at)
        return [TelemetryRead.model_validate(last_created_telemetry)]

    async def get_telemetry_by_field_id(self, field_id: UUID) -> List[TelemetryRead]:
        telemetry = await self.repository.get_telemetry_by_field_id(field_id)
        if not telemetry:
            raise TelemetryNotFound()
        return [TelemetryRead.model_validate(telemetry) for telemetry in telemetry]

    async def get_all_telemetry(self) -> List[TelemetryRead]:
        telemetry = await self.repository.get_all()
        return [TelemetryRead.model_validate(telemetry) for telemetry in telemetry]

    async def update_telemetry(self, telemetry_data: TelemetryUpdate, telemetry_id: UUID) -> TelemetryRead:
        updated_telemetry = await self.repository.update(telemetry_id, telemetry_data)
        if not updated_telemetry:
            raise TelemetryNotFound()
        return TelemetryRead.model_validate(updated_telemetry)

    async def delete_telemetry(self, telemetry_id: UUID) -> Dict:
        telemetry = await self.repository.delete(telemetry_id)
        if not telemetry:
            raise TelemetryNotFound()
        return {"message": "Telemetry deleted successfully"}
