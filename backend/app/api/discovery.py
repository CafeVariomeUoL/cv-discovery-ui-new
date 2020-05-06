import os, shutil, json, time
from pathlib import Path
from fastapi import APIRouter, File, UploadFile
from typing import Optional, List
from app.db import sources, eav_attributes, eav_values, eavs, discovery_settings, database, engine
from sqlalchemy.dialects.postgresql import insert

from app.api.process.phenopacket import process_phenopacket
from app.api.process.xlsx import process_xlsx
from app.api.process.vcf import process_vcf
from app.api.models import *
from sqlalchemy import case, select
from sqlalchemy.sql import text

router = APIRouter()

@router.get("/discover/getAttributes/{id}")
async def get_attributes(id: str):
    query = select([
            eav_attributes.c.eav_attribute.label("attribute"),
        ])

    print(query.compile(compile_kwargs={"literal_binds": True}))

    return await database.fetch_all(query=query)



@router.get("/discover/userIsAdminOf/{id}")
async def get_attributes(id: str):
    return True




@router.post("/discover/getAttributeValues")
async def get_attributes_vals(payload: AttributeValues):
    attr_id = json.dumps(payload.attribute)

    string = '%' + payload.string + '%' if payload.string else ''
    stm = """select array_agg(x.value) 
              from (select value from eav_values where eav_id = :id"""
    if payload.string:
        stm = stm + ' and value like :str'
    if payload.limit:
        stm = stm + ' limit :limit'
    if payload.offset:
        stm = stm + ' offset :offset'
    stm = stm + ') x'

    print(text(stm))

    rs = engine.execute(text(stm), id=attr_id, limit=payload.limit, offset=payload.offset, str=string)
    
    return list(rs)[0]['array_agg']
    




@router.get("/discover/loadSettings/{id}")
async def save_discovery_settings(id: str):
    query = select([discovery_settings.c.data]).where(discovery_settings.c.id == id)
    return await database.execute(query=query)



@router.post("/discover/saveSettings/{id}")
async def save_discovery_settings(id: str, data: dict):

    query = insert(discovery_settings).values(
            id=id,
            data=data
        ).on_conflict_do_update(
                index_elements=['id'],
                set_ = dict(data=data), 
            )

    return await database.execute(query=query)
     # {'status': 'success'}

