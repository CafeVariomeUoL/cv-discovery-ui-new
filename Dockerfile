FROM node:12 as frontend

COPY . /app
WORKDIR /app
RUN cd frontend && yarn install && yarn build




# pull official base image
FROM python:3.8.1-alpine

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# copy requirements file
COPY ./app/requirements.txt /app/requirements.txt

# install dependencies
RUN set -eux \
    && apk add --no-cache --virtual .build-deps build-base \
        libressl-dev libffi-dev gcc musl-dev python3-dev \
        postgresql-dev \
    && pip install --upgrade pip setuptools wheel \
    && pip install -r /usr/src/app/requirements.txt \
    && rm -rf /root/.cache/pip

# copy project
COPY . /app


COPY --from=frontend /app/frontend/build /app/frontend/build


ENV PORT=8000
EXPOSE $PORT
CMD uvicorn app.main:app --reload --workers 4 --host 0.0.0.0 --port $PORT
