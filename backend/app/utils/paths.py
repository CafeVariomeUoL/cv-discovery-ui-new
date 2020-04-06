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
    elif type(path) is str:
        return [eav]
    else:
        return []


def zip_map(t1, t2, f):
    if type(t1) is dict:
        return {k: zip_map(t1[k], t2[k], f) for k in t1.keys()}
    if type(t1) is list:
        return [zip_map(e, t2[0], f) for e in t1]
    return f(t1,t2)


def map_(t1, f):
    if type(t1) is dict:
        return {k: map_(v, f) for k,v in t1.items()}
    if type(t1) is list:
        return [map_(e, f) for e in t1]
    return f(t1)


def get_leaf(t1):
    if type(t1) is dict:
        return get_leaf(t1[next(iter(t1))])
    elif type(t1) is list:
        return get_leaf(t1[0])
    else:
        return t1

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
