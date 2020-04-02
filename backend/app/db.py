import os

from sqlalchemy import (Column,ForeignKey, DateTime, Integer, Text, MetaData, String, Boolean, JSON, Table,
                        create_engine)
from sqlalchemy.sql import func

from sqlalchemy.dialects.postgresql import JSONB

from databases import Database

DATABASE_URL = os.getenv("DATABASE_URL").replace("postgres://", "postgresql://")

# SQLAlchemy
engine = create_engine(DATABASE_URL)
metadata = MetaData()


sources = Table(
    "sources",
    metadata,
    Column("source_id", Integer, primary_key=True),
    Column("name", String(256), nullable=False),
    Column("file_path", String(256), nullable=False),
    Column("date", DateTime(), server_default=func.now()),
    Column("status", String(20), nullable=False)
)


eavs = Table(
    "eavs",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("source_id", Integer, ForeignKey(sources.c.source_id), nullable=False),
    Column("subject_id", String(256), nullable=False),
    Column("data", JSONB, nullable=False)
)


eavs2 = Table(
    "eavs2",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("source_id", Integer, ForeignKey(sources.c.source_id), nullable=False),
    Column("subject_id", String(256), nullable=False),
    Column("attribute", JSONB, nullable=False),
    Column("path", Text, nullable=False),
    Column("type", String(50), nullable=False),
    Column("value", Text, nullable=False)
)


eav_lookup = Table(
    "eav_lookup",
    metadata,
    Column("id", String(256), primary_key=True),
    Column("source_id", Integer, ForeignKey(sources.c.source_id), nullable=False),
    Column("label", String(256)),
    Column("visible", Boolean, nullable=False),
    Column("arbitrary_input", Boolean, nullable=False),
    Column("eav_attribute", JSON, nullable=False),
    Column("eav_values", JSONB, nullable=False)
)


eav_meta = Table(
    "eav_meta",
    metadata,
    Column("id", String(256), primary_key=True),
    Column("source_id", Integer, ForeignKey(sources.c.source_id), nullable=False),
    Column("label", String(256)),
    Column("visible", Boolean, nullable=False),
    Column("arbitrary_input", Boolean, nullable=False),
    Column("eav_attribute", JSON, nullable=False)
)

eav_values = Table(
    "eav_values",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("eav_id", String(256), ForeignKey(eav_meta.c.id)),
    Column("value", String(256), nullable=False)
)


discovery_settings = Table(
    "discovery_settings",
    metadata,
    Column("id", String(100), primary_key=True),
    Column("data", JSON, nullable=False)
)

# databases query builder
database = Database(DATABASE_URL)
