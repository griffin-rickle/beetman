from pathlib import Path

from pydantic import BaseModel


class BeetConfig(BaseModel):
    library_db_path: str
    library_directory: str
    library_path_format: str


class ServerConfig(BaseModel):
    database_path: Path


class Config(BaseModel):
    beets: BeetConfig
    server: ServerConfig
