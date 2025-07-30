from fastapi import APIRouter, UploadFile, Form

from backend.app.services.dataframe_service import SDataFrameService

route = APIRouter()

@route.get("/")
async def get_dataframe(dataframe_service: SDataFrameService, name: str, view_name: str):
    return await dataframe_service.get_data(name, view_name)

@route.post("/upload_file/{name}", status_code=200)
async def upload_file(dataframe_service: SDataFrameService, name: str, file: UploadFile, view_name: str = Form(...)):
    return await dataframe_service.upload_file(name, view_name, file)