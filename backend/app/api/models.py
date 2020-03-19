from pydantic import BaseModel, Json
from fastapi import File
from typing import Optional

class AttributeMeta(BaseModel):
    attribute: Json
    label: Optional[str]
    visible: Optional[bool]