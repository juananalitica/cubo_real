from fastapi import Depends, Request, UploadFile, HTTPException
from typing import Annotated

import os
import pandas as pd
from pathlib import Path

class DataFrameService:
  def __init__(self, request: Request) -> None:
    self.request = request
    self.data_cache = {}
  
  async def get_data(self, name: str, view_name: str):
    cache_key = (name, view_name)
    
    if cache_key in self.data_cache:
      return self.data_cache[cache_key]
    
    parquet_path = os.path.join(self.DATA_STORAGE_PATH, name, f"{view_name}.parquet")
    if not os.path.exists(parquet_path):
      raise HTTPException(status_code=404, detail=f"Data file not found: {parquet_path}.parquet")
    
    df = pd.read_parquet(parquet_path)
    self.data_cache[cache_key] = df
    
    return df
  
  DATA_STORAGE_PATH = Path(__file__).resolve().parent.parent.parent / "data/"
  async def upload_file(self, name: str, view_name: str, file: UploadFile):
    if not file.filename.endswith('.csv'):
      raise HTTPException(status_code=400, detail="Only CSV files are allowed")
  
    user_path = os.path.join(self.DATA_STORAGE_PATH, name)
    os.makedirs(user_path, exist_ok=True)
    
    try:
      df = pd.read_csv(file.file, sep=";", encoding="utf-8")
      cache_key = (name, view_name)
      self.data_cache[cache_key] = df
      
      parquet_path = os.path.join(user_path, f"{view_name}.parquet")
      df.to_parquet(parquet_path, index=False)
      return df.to_dict(orient="records")
    except Exception as e:
      raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

SDataFrameService = Annotated[DataFrameService, Depends(DataFrameService)]