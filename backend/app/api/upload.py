import os, shutil, json, time
from pathlib import Path
from fastapi import APIRouter, File, UploadFile
from typing import Optional, List
from app.db import sources, eav_attributes, eav_values, eavs, database, engine
from app.api.process.phenopacket import process_phenopacket
from app.api.process.xlsx import process_xlsx
from app.api.process.vcf import process_vcf
from app.api.models import *
from sqlalchemy import case, select
from sqlalchemy.sql import text

router = APIRouter()

upload_folder : str = './uploads/'


@router.put("/eavs/upload")
async def upload_process_file(upload_file: UploadFile = File(...), name: str = None, empty_delim: List[str] = []):
    global upload_folder
    global network_key
    file_object = upload_file.file
    file_name = upload_file.filename

    if len(empty_delim) == 1:
        empty_delim = empty_delim[0].split(',')

    tmp_file_path = os.path.join(upload_folder, file_name)

    #create empty file to copy the file_object to
    with open(tmp_file_path, 'wb') as tmp_file:
        shutil.copyfileobj(file_object, tmp_file)

    upload_file.file.close()

    await process_file(file_name, name, empty_delim)



@router.put("/eavs/process")
async def process_file(file_name: str, name: str = None, empty_delim: List[str] = []):
    global upload_folder
    start = time.time()

    print("empty_delim", empty_delim)
    tmp_file_path = os.path.join(upload_folder, file_name)

    query = sources.insert().values(
            name=name if name else file_name,
            file_path=tmp_file_path,
            status="processing"
        )
    source_id = await database.execute(query=query)

    path = Path(file_name)

    print(path.suffixes)

    if(path.suffix == '.phenopacket'):
        with open(tmp_file_path, 'r') as tmp_file:
            pheno_packet = json.loads(tmp_file.read())
            await process_phenopacket(source_id, pheno_packet)
    
    elif(path.suffix == '.xlsx'):
        await process_xlsx(source_id, tmp_file_path, empty_delim)

    elif(path.suffix == '.vcf' or path.suffixes == [".vcf",".gz"]):
        await process_vcf(source_id, tmp_file_path, empty_delim)

    end = time.time()
    return {"filename": file_name, 'time': end - start }



@router.put("/eavs/clearDB")
async def clear_db():
    await database.execute(query=eavs.delete())
    await database.execute(query=eav_values.delete())
    await database.execute(query=eav_attributes.delete())
    await database.execute(query=sources.delete())