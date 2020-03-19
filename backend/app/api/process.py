import json, re, datetime
import pandas as pd
from sqlalchemy.dialects.postgresql import insert
from app.db import eavs, eav_lookup, sources, database

class HashableDict(dict):
    def __hash__(self):
        return hash(frozenset(self))


class HashableList(list):
    def __hash__(self):
        return hash(frozenset(self))


def flatten(l): 
    return [item for sublist in l for item in sublist]


def create_all_paths(eav):
    if type(eav) is list:
        return [HashableList([r]) for v in eav for r in list(create_all_paths(v))]
    elif type(eav) is dict:
        return [HashableDict({k: v}) for k in eav.keys() for v in list(create_all_paths(eav[k]))]
    elif type(eav) is type:
        return [eav.__name__]
    else:
        return [type(eav).__name__]


def collect_value_from_path(path, eav):
    if type(path) is HashableList and type(eav) is list:
        nxt = path[0]
        return flatten([collect_value_from_path(nxt, e) for e in eav])
    elif type(path) is HashableDict and type(eav) is dict and next(iter(path)) in eav.keys() :
        nxt = path[next(iter(path))]
        return collect_value_from_path(nxt, eav[next(iter(path))])
    elif type(path) is str and path == 'str':
        return [eav]
    else:
        return []


async def process_phenopacket(source_id, pheno_packet):
    all_paths = set(create_all_paths(pheno_packet))

    for p in all_paths:
        values = list(set(collect_value_from_path(p, pheno_packet)))
        # if values != ['']:
        query = insert(eav_lookup).values(
                id=json.dumps(p),
                source_id=source_id,
                eav_attribute= p,
                visible=True,
                eav_values=values
            ).on_conflict_do_update(
                index_elements=['id'],
                set_ = dict(eav_values=eav_lookup.c.eav_values + values), 
            )
        await database.execute(query=query)

    query = eavs.insert().values(
        source_id=source_id,
        subject_id=pheno_packet['id'],
        data=pheno_packet)
    await database.execute(query=query)

    await processing_done(source_id)


def supertype(ts):
    if str in ts:
        return str
    if float in ts:
        return float
    if datetime.datetime in ts:
        return datetime.datetime
    if pd._libs.tslibs.timestamps.Timestamp in ts:
        return datetime.datetime
    if len(ts) == 1:
        return ts.pop()
    raise ValueError("Don't know how to choose a supertype for ", ts)


def cast(val, ty):
    if type(val) is ty:
        if ty is datetime.datetime:
            val.__str__()
        else:
            return val
    if ty is str:
        return str(val)
    if ty is float:
        return float(val)
    if ty is datetime.datetime:
        if type(val) is pd._libs.tslibs.timestamps.Timestamp:
            return val.to_pydatetime().__str__()
        else:
            return val.__str__()
    raise ValueError("Don't know how to cast ", val, "of type" , type(val), " to ", ty)


def zip_map(t1, t2, f):
    if type(t1) is dict:
        return {k: zip_map(t1[k], t2[k], f) for k in t1.keys()}
    if type(t1) is list:
        return [zip_map(e, t2[0], f) for e in t1]
    return f(t1,t2)


def map(t1, f):
    if type(t1) is dict:
        return {k: map(t1[k], f) for k in t1.keys()}
    if type(t1) is list:
        return [map(e, f) for e in t1]
    return f(t1)


async def mk_json_structure_insert_into_eav_lookup(source_id, headers, empty_delim, data):
    data_ptr = 1
    group_counter = 0
    group_size = 0
    res_empty = {}
    res_type = {}
    res_all_vals = {}
    res = {}
    grp_empty = {}
    grp_type = {}
    grp_all_vals = {}
    grp = {}

    for h in headers[1:]:
        group_size = group_size + 1
        if '<group_end>' in h:
            if group_size == 2:
                res_empty.update(grp_empty)
                res_type.update(grp_type)
                res_all_vals.update(grp_all_vals)
                res.update(grp)
            else:
                flag = True
                for i in range(group_counter):
                    if type(res_empty[i]) is dict and HashableDict(grp_empty) == HashableDict(res_empty[i]):
                        res_empty[i] = [res_empty[i]]
                        res_type[i] = [zip_map(res_type[i], grp_type, lambda t1, t2: supertype(set([t1,t2])))]
                        res_all_vals[i] = [res_all_vals[i]]
                        res[i] = [res[i], grp]
                        flag = False
                        break
                    elif type(res_empty[i]) is list and HashableList([grp_empty]) == HashableList(res_empty[i]):
                        res_type[i] = [zip_map(res_type[i][0], grp_type, lambda t1, t2: supertype(set([t1,t2])))]
                        res[i].append(grp)
                        flag = False
                        break
                if flag:
                    res_empty[group_counter] = grp_empty
                    res_type[group_counter] = grp_type
                    res_all_vals[group_counter] = grp_all_vals
                    res[group_counter] = grp
                    group_counter = group_counter + 1
            grp_empty = {}
            grp_type = {}
            grp_all_vals = {}
            grp = {}
            group_size = 0
        else:
            grp_empty[h] = None
            grp_type[h] = supertype(set([type(x) for x in data.iloc[:,data_ptr]]))
            grp_all_vals[h] = []
            if grp_type[h] is str:
                grp_all_vals[h] = list(set([cast(x, grp_type[h]) for x in data.iloc[:,data_ptr]]))
            grp[h] = data_ptr
        data_ptr = data_ptr + 1

    all_paths = create_all_paths(res_type)

    for p in all_paths:
        values = flatten(collect_value_from_path(p, res_all_vals))
        filter(lambda x: str(x) != str(empty_delim), values)
        print(values)

        query = insert(eav_lookup).values(
                id=json.dumps(p),
                source_id=source_id,
                eav_attribute= p,
                visible=True,
                eav_values= values
            ).on_conflict_do_update(
                index_elements=['id'],
                set_ = dict(eav_values=eav_lookup.c.eav_values + values), 
            )
        await database.execute(query=query)

    return zip_map(res, res_type, lambda x, y: (x,y))


def populate_entry(undefined_val, row):
    def populate_entry_fun(v):
        index, ty = v
        if str(row[index]) == str(undefined_val):
            return None
        else:
            return cast(row[index], ty)
    return populate_entry_fun


def prune_empty(x):
    if type(x) is dict:
        ret = {}
        for k in x.keys():
            r = prune_empty(x[k])
            if r:
                ret[k] = r
        return ret
    if type(x) is list:
        ret = []
        for e in x:
            r = prune_empty(e)
            if r:
                ret.append(r)
        return ret
    return x 

async def insert_xlsx_into_eavs(source_id, structure, empty_delim, data):
    buf = []
    for _, row in data.iterrows():
        data = map(structure, populate_entry(empty_delim, row))
        buf.append({
                'source_id': source_id,
                'subject_id': str(row[0]),
                'data': prune_empty(data)
            })

    query = eavs.insert().values(buf)
    await database.execute(query=query)


async def process_xlsx(source_id, file_name, empty_delim):
    df = pd.read_excel(file_name, sheet_name=0)

    # if headers have the same name, pandas appends a .1, .2, ...etc
    # for each column which is the same...
    headers = [re.sub("\.\d+\Z", '', c) for c in df.columns.values]

    if headers[0] != 'subject_id': 
        return {"error": "'subject_id' is not the first value in the table!"}

    structure = await mk_json_structure_insert_into_eav_lookup(source_id, headers, empty_delim, df)

    await insert_xlsx_into_eavs(source_id, structure, empty_delim, df)
    await processing_done(source_id)


async def processing_done(source_id):
    query = sources.update().where(sources.c.source_id==source_id).\
        values(status='done')
    await database.execute(query=query)
