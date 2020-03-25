import os, shutil, json

from fastapi import APIRouter, File, UploadFile
from app.db import eavs, database
from app.api.models import *
from sqlalchemy import and_, or_, func, exists, select, column, Integer, Float
from sqlalchemy.dialects import postgresql

router = APIRouter()



def get_type(eav):
    if type(eav) is list:
        return get_type(eav[0])
    elif type(eav) is dict:
        return get_type(eav[next(iter(eav))])
    else:
        return eav


def mkPathStm(stm, eav, getJSONobject = False):
    if type(eav) is dict:
        if getJSONobject or type(eav[next(iter(eav))]) is dict:
            _, res = mkPathStm(stm.op('->')(next(iter(eav))), eav[next(iter(eav))])
            
        else:
            _, res = mkPathStm(stm.op('->>')(next(iter(eav))), eav[next(iter(eav))])
        return False, res
    else:
        return True, stm


def mkAttributeQuery(stm, eav, val, ty, op):
        isbare, stm = mkPathStm(stm, eav)
        if ty == 'int':
            cast_stm = stm.cast(Integer)
            cast_val = int(val)
        elif ty == 'float':
            cast_stm = stm.cast(Float) 
            cast_val = float(val)
        elif ty == 'str':
            cast_stm = stm
            if isbare:
                cast_val = '"' + val + '"'
            else:
                cast_val = val

        if op == 'is':
            return cast_stm == cast_val
        if op == 'is not':
            return cast_stm != cast_val
        if op == '>':
            return cast_stm > cast_val
        if op == '>=':
            return cast_stm >= cast_val
        if op == '<':
            return cast_stm < cast_val
        if op == '<=':
            return cast_stm <= cast_val


# 
# def aggregateArrayQueries




def mkGroupQuery(source, qg: QueryGroup):
    def basicOrGroupQuery(s):
        def f(e : Union[BaseQuery, QueryGroup]):
            if isinstance(e, BaseQuery):
                return mkAttributeQuery(s, e.attribute, e.value, get_type(e.attribute), e.operator)
            if isinstance(e, QueryGroup):
                return mkGroupQuery(s, e)
        return f

    if (qg.operator == BoolOp.andOp):
        subExprs = map(basicOrGroupQuery(source), qg.children)
        return and_(*subExprs)
    elif (qg.operator == BoolOp.orOp):
        subExprs = map(basicOrGroupQuery(source), qg.children)
        return or_(*subExprs)
    elif (qg.operator == Quantifier.exists):
        _, arr = mkPathStm(source, qg.from_, True)
        tmp = func.jsonb_array_elements(arr).alias()
        subExprs = map(basicOrGroupQuery(column(tmp.name)), qg.children)
        return exists(select().select_from(tmp).where(*subExprs))


@router.post("/query")
async def query(payload: Query):
    stmt = mkGroupQuery(eavs.c.data, payload.query)
    print(payload.query)
    print((eavs.select().where(stmt)).compile(compile_kwargs={"literal_binds": True}, dialect=postgresql.dialect()))
    
    

    query = eavs.select().where(stmt)
    res = await database.fetch_all(query=query)
    return {'count': len(res)}