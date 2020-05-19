import os, shutil, json

from fastapi import APIRouter, File, UploadFile
from app.db import eavs, hpo_sims, database
from app.api.models import *
from app.utils.paths import map_, get_leaf
from sqlalchemy import and_, or_, func, exists, select, column, Integer, Float
from sqlalchemy.dialects import postgresql
from app.utils.types import cast, str_to_ty

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
            _, res = mkPathStm(stm.op('->')(next(iter(eav))), eav[next(iter(eav))], getJSONobject)
            
        else:
            _, res = mkPathStm(stm.op('->>')(next(iter(eav))), eav[next(iter(eav))])
        return False, res
    else:
        return True, stm



def optimiseQuery(q: Union[BaseQuery, GroupQuery]):
    if isinstance(q, BaseQuery) and q.operator == "is":
        return IsQuery(attribute=map_(q.attribute, lambda x: cast(q.value, str_to_ty(get_leaf(q.attribute)))))

    # rewrite an `∃ x ∈ S. x = a` into `_ @> S({[x:a]})` optimised query
    if isinstance(q, GroupQuery) and q.operator == Quantifier.exists:
        res = optimiseQuery(q.children[0])
        if isinstance(res, IsQuery):
            return IsQuery(attribute=map_(q.from_, lambda x: [res.attribute]))
        else:
            q_new = GroupQuery(children=[res], operator=Quantifier.exists)
            q_new.from_ = q.from_
            return q_new
    if isinstance(q, GroupQuery):
        q.children = list(map(optimiseQuery, q.children))
        return q
    return q



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





def basicOrGroupQuery(s):
    def f(e : Union[BaseQuery, GroupQuery, SimilarityQuery]):
        if isinstance(e, IsQuery):
            return [] , s.op('@>')(json.dumps(e.attribute))
        if isinstance(e, BaseQuery):
            r = mkAttributeQuery(s, e.attribute, e.value, get_type(e.attribute), e.operator)
            return [] , r
        if isinstance(e, GroupQuery):
            return mkGroupQuery(s, e)
        if isinstance(e, SimilarityQuery):
            return [], None
    return f



def mkGroupQuery(source, qg: GroupQuery):
    if (qg.operator == BoolOp.andOp):
        res = list(map(basicOrGroupQuery(source), qg.children))
        subExprs = [e for _,e in res if e is not None]
        sources = [s for src,_ in res for s in src]
        return sources, and_(*subExprs)
    elif (qg.operator == BoolOp.orOp):
        res = list(map(basicOrGroupQuery(source), qg.children))
        subExprs = [e for _,e in res if e is not None]
        sources = [s for src,_ in res for s in src]
        return sources, or_(*subExprs)
    elif (qg.operator == Quantifier.exists):
        _, arr = mkPathStm(source, qg.from_, True)
        tmp = func.jsonb_array_elements(arr).alias()
        res_ls, subExpr = basicOrGroupQuery(column(tmp.name))(qg.children[0])
        return ([tmp] + res_ls), subExpr






def simQuery(q, e : Union[BaseQuery, GroupQuery, SimilarityQuery]):
    if isinstance(e, IsQuery):
        return q
    if isinstance(e, BaseQuery):
        return q
    if isinstance(e, GroupQuery):
        simQ = next(x for x in e.children if isinstance(x, SimilarityQuery))
        if(e.operator == BoolOp.andOp):
            return q.intersect(mkSimQuery(simQ))
        if(e.operator == BoolOp.orOp):
            return q.union(mkSimQuery(simQ))
    if isinstance(e, SimilarityQuery):
        return mkSimQuery(e)






def mkSetQuery(q: SetQuery):
    if isinstance(q.from_, SetQuery):
        ss, r = mkSetQuery(q.from_)
        _, arr = mkPathStm(column(ss[-1]).name, r, True)
        src = func.jsonb_array_elements(arr).alias()
    else:
        ss = []
        _, arr = mkPathStm(eavs.c.data, q.from_, True)
        src = func.jsonb_array_elements(arr).alias()

    _, r = mkPathStm(column(src.name), q.path)

    return (ss + [src]), r


    # q = select([r]).where(eavs.c.id == al.c.id)
    # print(q.compile(compile_kwargs={"literal_binds": True}, dialect=postgresql.dialect()))



def mkSimQuery(qs: SimilarityQuery):
    print(qs)

    srcs, setQ = mkSetQuery(qs.from_)



    q = select([eavs.c.subject_id, eavs.c.data])

    for s in [eavs] + srcs:
        q = q.select_from(s)

    q = q.where(
            setQ.in_(
                select([hpo_sims.c.target]).where(and_(hpo_sims.c.source.in_(qs.hpos), hpo_sims.c.rel >= qs.similarity))
            )
        ).group_by(eavs.c.subject_id, eavs.c.data).having(func.count(eavs.c.subject_id) >= qs.match)




    # select([func.count()]).select_from(select([setQ])
    #     .where(eavs.c.id == alias.c.id)
    #     .intersect(select([hpo_sims.c.target])
    #         .where(and_(hpo_sims.c.source.in_(qs.hpos), hpo_sims.c.rel >= qs.similarity))).alias()).as_scalar() >=  qs.match


    #          # >= qs.match
 
    return q
    # print(q.compile(compile_kwargs={"literal_binds": True}, dialect=postgresql.dialect()))

  




@router.post("/query")
async def query(payload: Query):
    # print("q: ", payload.query)
    # print("q_opt: ", optimiseQuery(payload.query))
    srcs, stmt = basicOrGroupQuery(eavs.c.data)(optimiseQuery(payload.query))
    # print(payload.query)
    srcs = [eavs] + srcs


    query = select([func.distinct(eavs.c.subject_id), eavs.c.data])

    for s in srcs:
        query = query.select_from(s)
    
    query = query.where(stmt)

    query = simQuery(query, payload.query)

    print(query.compile(compile_kwargs={"literal_binds": True}, dialect=postgresql.dialect()))
    res = await database.fetch_all(query=query)

    if payload.result_type and payload.result_type == 'full':
        return {'full': [row['data'] for row in res]}
    else:
        return {'count': len(res)}
