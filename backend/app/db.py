import os

from sqlalchemy import (Column,ForeignKey, DateTime, Integer, MetaData, String, Boolean, JSON, Table,
                        create_engine)
from sqlalchemy.sql import func

from sqlalchemy.dialects.postgresql import JSONB

from databases import Database

DATABASE_URL = os.getenv("DATABASE_URL")

# SQLAlchemy
engine = create_engine(DATABASE_URL)
metadata = MetaData()


sources = Table(
    "sources",
    metadata,
    Column("source_id", Integer, primary_key=True),
    Column("name", String(50), nullable=False),
    Column("file_path", String(50), nullable=False),
    Column("date", DateTime(), server_default=func.now()),
    Column("status", String(20), nullable=False)
)


eavs = Table(
    "eavs",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("source_id", Integer, ForeignKey(sources.c.source_id), nullable=False),
    Column("subject_id", String(20), nullable=False),
    Column("data", JSONB, nullable=False)
)


eav_lookup = Table(
    "eav_lookup",
    metadata,
    Column("id", String(128), primary_key=True),
    Column("source_id", Integer, ForeignKey(sources.c.source_id), nullable=False),
    Column("label", String(32)),
    Column("visible", Boolean, nullable=False),
    Column("eav_attribute", JSON, nullable=False),
    Column("eav_values", JSONB, nullable=False)
)

# databases query builder
database = Database(DATABASE_URL)
