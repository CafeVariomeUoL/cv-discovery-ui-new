import os, shutil, json

from fastapi import APIRouter, File, UploadFile
from typing import Optional
from app.db import sources, eav_lookup, database
from app.api.process import process_phenopacket, process_xlsx
from app.api.models import *

router = APIRouter()

upload_folder : str = './uploads/'


@router.post("/eavs/upload")
async def create_file(upload_file: UploadFile = File(...), name: str = None, empty_delim: str = None):
    global upload_folder
    global network_key
    file_object = upload_file.file
    file_name = upload_file.filename



    tmp_file_path = os.path.join(upload_folder, file_name)

    #create empty file to copy the file_object to
    with open(tmp_file_path, 'wb') as tmp_file:
        shutil.copyfileobj(file_object, tmp_file)

    upload_file.file.close()

    query = sources.insert().values(
            name=name if name else file_name,
            file_path=tmp_file_path,
            status="processing"
        )
    source_id = await database.execute(query=query)

    _, file_extension = os.path.splitext(file_name)

    if(file_extension == '.phenopacket'):
        # person_dict = json.loads(person)
        with open(tmp_file_path, 'r') as tmp_file:
            pheno_packet = json.loads(tmp_file.read())
            await process_phenopacket(source_id, pheno_packet)
    
    elif(file_extension == '.xlsx'):
        await process_xlsx(source_id, tmp_file_path, empty_delim)

    return {"filename": file_name}


@router.get("/eavs/getAttributes")
async def get_attributes():
    query = eav_lookup.select()
    res = await database.fetch_all(query=query)
    ret = []

    for r in res:
        ret_d = {
                'attribute': r['eav_attribute'], 
                'visible': r['visible']
            }
        if r['label']:
            ret_d['label'] = r['label']
        if r['eav_values']:
            print(r['eav_values'])
            ret_d['values'] = set(r['eav_values'])

        ret.append(ret_d)
    return ret


@router.post("/eavs/setAttributeMeta")
async def set_attribute_meta(payload: AttributeMeta):
    attr_id = json.dumps(payload.attribute)
    nm = ''
    if payload.label: 
        query = eav_lookup.update()\
            .values(label=payload.label)\
            .where(eav_lookup.c.id == attr_id)
        await database.execute(query=query)
    if payload.visible: 
        query = eav_lookup.update()\
            .values(visible=payload.visible)\
            .where(eav_lookup.c.id == attr_id)
        await database.execute(query=query)
    return {'status': 'success'}
    
