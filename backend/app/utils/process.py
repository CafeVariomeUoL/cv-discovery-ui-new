from app.db import sources, eav_values, database, engine
from sqlalchemy.sql import text



def clean_up_eav_values():
    statement = text("""DELETE FROM eav_values WHERE id IN
        (SELECT id FROM 
            (SELECT id,
             ROW_NUMBER() OVER( PARTITION BY eav_id, value ORDER BY id ) AS row_num
            FROM eav_values) t
            WHERE t.row_num > 1) or value = '';""")
    engine.execute(statement)

    

async def processing_done(source_id):
    query = sources.update().where(sources.c.source_id==source_id).\
        values(status='done')
    await database.execute(query=query)