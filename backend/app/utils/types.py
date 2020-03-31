import datetime, pandas as pd

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
    if ty is int:
        return int(val)
    if ty is datetime.datetime:
        if type(val) is pd._libs.tslibs.timestamps.Timestamp:
            return val.to_pydatetime().__str__()
        else:
            return val.__str__()
    raise ValueError("Don't know how to cast ", val, "of type" , type(val), " to ", ty)

def cast_(ty):
    if type(ty) is list:
        return lambda x: cast(x, ty[0])
    else:
        return lambda x: cast(x, ty)
