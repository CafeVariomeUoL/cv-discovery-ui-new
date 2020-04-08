# Project overview

This project contains the `frontend/` discovery React app, which talks to the `backend/` REST API, currently written in Python, using the FastAPI framework. 


## Dev mode
The whole project can be built and deployed in dev mode using docker compose, by running

```bash
docker-compose up -d
```

See `docker-compose.yml` for details of what containers are deployed. Briefly, we have:

-   `web` which is the Python web server, hosting the REST API
-   `db`, a Postgres database
-   `dev` the development server for the react frontend


## Heroku demo

There is a demo site deployed on a Heroku server at https://cv-new.herokuapp.com/. This build uses the `Dockerfile` in the root of this repository, which compiles the react app and uses nginx to server up the React app and a reverse proxy to a uvicorn server, which serves the api from the same domain.

To push changes to Heroku, we use

```bash
git push heroku master
```

For detail on deploying to Heroku, see https://devcenter.heroku.com/articles/git

## Deployment details

There are a few params which need to be set, when deploying the front/backend:

### Frontend

-   If the front end is being hosted in a subdirectory on the web server, e.g. at https://cv-new.herokuapp.com/discovery, we need to make sure that the parameter `homepage` is set accordingly in `frontend/package.json`:

    ```json
    ...
    "homepage": "/discovery/",
    ...
    ```

-   If the API is hosted on a different server or under a different subdirectory (i.e. not `/api`), we need to modify the `REACT_APP_API_URL` variable in `frontend/.env.production` accordingly.

### Backend

If using the Python server as backend, ensure that the live environment contains a valid `DATABASE_URL` variable. If unset, the default connection string will be the dev one, defined in `docker-compose.yml`:

```bash
postgresql://hello_fastapi:hello_fastapi@db/hello_fastapi_dev
```


## Backend architecture

The backend is a very simple REST server written in Python, using FastAPI. The reason this framework was chose was because its apparently fast and supports OpenAPI "standards". This means that one can declare models of requests and responses (`backend/api/models.py`). The main use case is the definition of a `Query`:

```python
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
```

This corresponds to a pseudo BNF/JSON grammar, where `?json` means the field is an optional json value, `BaseQuery | GroupQuery` means either `BaseQuery` or `GroupQuery` and `[BaseQuery | GroupQuery]` is a list of either:


```
Query ::= BaseQuery | GroupQuery

BaseQuery ::= {
    attribute: json
    operator: BaseBoolOp
    value: string
}

GroupQuery ::= {
    operator: (BoolOp | Quantifier) 
    from: ?json
    children: [BaseQuery | GroupQuery]
}

BaseBoolOp ::= 'is' | 'is like' | 'is not' | 'is not like' | '<' | '<=' | '>' | '>='

BoolOp ::= 'and' | 'or'

Quantifier ::= 'exists'
```

## Data Model


### Simple queries

The way we store data in the Postgres is structure agnostic. This means we can store any valid json file in the database and query its parameters. For example, if we store the following patient record:

```json
{
    "id": 1,
    "name": "Jane Doe",
    "age": 30,
    "gender": "female",
}
```

we can query the database for a record where `age` is greater than 25, by running the following Postgres query:

```sql
select * from eavs where (data ->> 'age')::integer > 25
```

To execute this query via the REST API, we would do a POST request to the `/api/query` endpoint, sending the following payload:

```json
{
    "query": {
        "attribute": {"age": "int"},
        "operator": ">",
        "value": "25"
    }
}
```

The React frontend generates this kind of JSON object for every query. 

### Compound queries

For complex queries, like `age` > 25 and `gender` female, where the SQL query would be:

```sql
select * from eavs where (data ->> 'age')::integer > 25 and data ->> 'gender' = 'female'
```

We use the `GroupQuery` schema:

```json
{
    "query": {
        "operator": "and",
        "children": [
            {
                "attribute": {"age": "int"},
                "operator": ">",
                "value": "25"
            },
            {
                "attribute": {"gender": "str"},
                "operator": "is",
                "value": "female"
            }
        ]
    }
}
```

We can store and query JSON documents with arbitrary structure and nesting, for example, if we extend our patient record:

```json
{
    "id": 1,
    "name": "Jane Doe",
    "age": 30,
    "gender": "female",
    "stats": {
        "height": 186,
        "blood_group": "AB"
    }
}
```

To query the database for a record with the `blood_group` AB, we would run the following SQL query:

```sql
select * from eavs where data -> 'stats' ->> 'blood_group' = 'AB'
```

The corresponding API query is:

```json
{
    "query": {
        "attribute": {"stats": {"blood_group": "str"}},
        "operator": "is",
        "value": "AB"
    }
}
```


### Queries over lists

So far, we can query arbitrary nesting of JSON dicts. However, we also want to be able to extend our record to have a list of attributes, such as:

```json
{
    "id": 1,
    "name": "Jane Doe",
    "age": 30,
    "gender": "female",
    "stats": {
        "height": 186,
        "blood_group": "AB"
    },
    "hospital_visits": ["2020-04-08T00:00:00.000Z", "2020-01-26T00:00:00.000Z"]
}
```

When querying the parameter `hospital_visits` the most likely query we want to ask is if there exists an element in the list of `hospital_visits` such that `?`. For example, this is the query for finding all patients that had a hospital visit after January 1st, 2020:


```sql
select * from eavs where 
    exists (select * from jsonb_array_elements(data -> 'hospital_visits') as x where 
        (x::text)::timestamp > '2020-01-01T00:00:00.000Z')
```



The reason why we have an `exists` query, is the following. Say


at in order to query a record like 

