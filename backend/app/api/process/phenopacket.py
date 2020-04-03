import json
from app.db import eavs, eav_attributes, eav_values, database, engine
from sqlalchemy.dialects.postgresql import insert
from app.utils.paths import create_all_paths, collect_value_from_path
from app.utils.process import clean_up_eav_values, processing_done



async def process_phenopacket(source_id, pheno_packet):
    all_paths = set(create_all_paths(pheno_packet))

    for p in all_paths:
        values = list(set(collect_value_from_path(p, pheno_packet)))
        filter(lambda x: x == True, values)
        if values:
            eav_id = json.dumps(p)
            queryAttr = insert(eav_attributes).values(
                    id=eav_id,
                    source_id=source_id,
                    eav_attribute= p,
                ).on_conflict_do_nothing()
            await database.execute(query=queryAttr)

            buf = [{'eav_id':eav_id, 'value':v} for v in values]
            engine.execute(eav_values.insert(), buf)

    query = eavs.insert().values(
        source_id=source_id,
        subject_id=pheno_packet['id'],
        data=pheno_packet)
    await database.execute(query=query)


    clean_up_eav_values()
    await processing_done(source_id)
