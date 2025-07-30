from fastapi import APIRouter

from backend.app.controllers.dataframe_controller import route as dataframe_route

routes = APIRouter()

routes.include_router(dataframe_route, prefix="/df", tags=["DataFrame"])