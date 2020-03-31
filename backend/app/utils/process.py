from app.db import sources, database


async def processing_done(source_id):
    query = sources.update().where(sources.c.source_id==source_id).\
        values(status='done')
    await database.execute(query=query)