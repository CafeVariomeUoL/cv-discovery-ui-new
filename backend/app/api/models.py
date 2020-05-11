from __future__ import annotations
from pydantic import BaseModel, Json
from enum import Enum
from fastapi import File
from typing import List, Optional, Union, Any

class AttributeMeta(BaseModel):
    attribute: dict
    label: Optional[str]
    visible: Optional[bool]
    arbitrary_input: Optional[bool]

class AttributeValues(BaseModel):
    attribute: dict
    string: Optional[str]
    limit: Optional[int]
    offset: Optional[int]

class DiscoverySettings(BaseModel):
    id_:str
    data: dict

    class Config:
        fields = {
        'id_': 'id'
        }

    

class BoolOp(str, Enum):
    andOp = 'and'
    orOp = 'or'


class Quantifier(str, Enum):
    exists = 'exists'


class BaseBoolOp(str, Enum):
    isOp = 'is'
    isLikeOp = 'is like'
    isNotOp = 'is not'
    isNotLikeOp = 'is not like'
    ltOp = '<'
    ltEqOp = '<='
    gtOp = '>'
    gtEqOp = '>='

class BaseQuery(BaseModel):
    attribute: Union[dict, str]
    operator: BaseBoolOp
    value: str


class IsQuery(BaseModel):
    attribute: Any


class GroupQuery(BaseModel):
    children: List[Union[BaseQuery, 'GroupQuery']]
    operator: Union[BoolOp, Quantifier]
    from_: Optional[dict]

    class Config:
        fields = {
        'from_': 'from'
        }

GroupQuery.update_forward_refs()


class Query(BaseModel):
    query: Union[BaseQuery, GroupQuery]
    result_type: Optional[str]
