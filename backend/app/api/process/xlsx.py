import pandas as pd, re, json
from sqlalchemy.dialects.postgresql import insert
from app.db import eavs, eav_attributes, eav_values, database, engine
from app.api import process
from app.utils.types import supertype, cast
from app.utils.paths import HashableDict, HashableList, zip_map, map_, prune_empty, flatten, create_all_paths, collect_value_from_path
from app.utils.process import processing_done, clean_up_eav_values



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
                    if type(res_empty['grp'+str(i)]) is dict and HashableDict(grp_empty) == HashableDict(res_empty['grp'+str(i)]):
                        res_empty['grp'+str(i)] = [res_empty['grp'+str(i)]]
                        res_type['grp'+str(i)] = [zip_map(res_type['grp'+str(i)], grp_type, lambda t1, t2: supertype(set([t1,t2])))]
                        res_all_vals['grp'+str(i)] = [res_all_vals['grp'+str(i)]]
                        res['grp'+str(i)] = [res['grp'+str(i)], grp]
                        flag = False
                        break
                    elif type(res_empty['grp'+str(i)]) is list and HashableList([grp_empty]) == HashableList(res_empty['grp'+str(i)]):
                        res_type['grp'+str(i)] = [zip_map(res_type['grp'+str(i)][0], grp_type, lambda t1, t2: supertype(set([t1,t2])))]
                        res['grp'+str(i)].append(grp)
                        flag = False
                        break
                if flag:
                    res_empty['grp'+str(group_counter)] = grp_empty
                    res_type['grp'+str(group_counter)] = grp_type
                    res_all_vals['grp'+str(group_counter)] = grp_all_vals
                    res['grp'+str(group_counter)] = grp
                    group_counter = group_counter + 1

            grp_empty = {}
            grp_type = {}
            grp_all_vals = {}
            grp = {}
            group_size = 0
        else:
            grp_empty[h] = None
            grp_type[h] = supertype(set([type(x) for x in data.iloc[:,data_ptr]]))
            grp_all_vals[h] = list(set([cast(x, grp_type[h]) for x in data.iloc[:,data_ptr]]))
            grp[h] = data_ptr
        data_ptr = data_ptr + 1

    all_paths = create_all_paths(res_type)

    for p in all_paths:
        values = flatten(collect_value_from_path(p, res_all_vals))
        filter(lambda x: str(x) not in empty_delim, values)
        # print(values)
        eav_id = json.dumps(p)

        query = insert(eav_attributes).values(
                id=eav_id,
                source_id=source_id,
                eav_attribute= p,
            ).on_conflict_do_nothing()
            # .on_conflict_do_nothing()
            #     index_elements=['id'],
            #     set_ = dict(eav_values=eav_lookup.c.eav_values + values), 
            # )
        await database.execute(query=query)
        buf = [{'eav_id':eav_id, 'value':v} for v in values]
        engine.execute(eav_values.insert(), buf)


    return zip_map(res, res_type, lambda x, y: (x,y))


def populate_entry(undefined_val, row):
    def populate_entry_fun(v):
        index, ty = v
        if str(row[index]) == str(undefined_val):
            return None
        else:
            return cast(row[index], ty)
    return populate_entry_fun



async def insert_xlsx_into_eavs(source_id, structure, empty_delim, data):
    buf = []
    for _, row in data.iterrows():
        d = map_(structure, populate_entry(empty_delim, row))
        buf.append({
                'source_id': source_id,
                'subject_id': str(row[0]),
                'data': prune_empty(d)
            })

        if len(buf) > 1000:
            print("got here...")
            engine.execute(eavs.insert(), buf)
            buf = []

    engine.execute(eavs.insert(), buf)


async def process_xlsx(source_id, file_name, empty_delim):
    df = pd.read_excel(file_name, sheet_name=0)

    # if headers have the same name, pandas appends a .1, .2, ...etc
    # for each column which is the same...
    headers = [re.sub("\.\d+\Z", '', c) for c in df.columns.values]

    if headers[0] != 'subject_id': 
        return {"error": "'subject_id' is not the first value in the table!"}

    structure = await mk_json_structure_insert_into_eav_lookup(source_id, headers, empty_delim, df)

    await insert_xlsx_into_eavs(source_id, structure, empty_delim, df)
    clean_up_eav_values()
    await processing_done(source_id)
