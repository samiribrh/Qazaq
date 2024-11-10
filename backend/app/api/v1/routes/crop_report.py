from typing import Dict, List
from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.v1.schemas.crop_report import CropReportRead
from app.services.crop_report import CropReportService


router = APIRouter()


@router.get("/", response_model=List[CropReportRead], status_code=status.HTTP_200_OK)
async def get_crop_reports(crop_report_service: CropReportService = Depends()):
    return await crop_report_service.get_all_crop_reports()


@router.get("/field/{field_id}", response_model=List[CropReportRead], status_code=status.HTTP_200_OK)
async def get_crop_reports_by_field_id(field_id: UUID, crop_report_service: CropReportService = Depends()):
    return await crop_report_service.get_crop_reports_by_field_id(field_id)


@router.get("/device/{device_id}", response_model=List[CropReportRead], status_code=status.HTTP_200_OK)
async def get_crop_reports_by_device_id(device_id: UUID, crop_report_service: CropReportService = Depends()):
    return await crop_report_service.get_crop_reports_by_device_id(device_id)


@router.delete("/{report_id}", response_model=dict, status_code=status.HTTP_200_OK)
async def delete_crop_report(report_id: UUID, crop_report_service: CropReportService = Depends()):
    return await crop_report_service.delete_crop_report(report_id)
