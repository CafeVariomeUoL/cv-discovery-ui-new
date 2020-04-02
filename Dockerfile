FROM node:12 as frontend

COPY . /app
WORKDIR /app
RUN cd frontend && yarn install && yarn build




# pull official base image
FROM tiangolo/uvicorn-gunicorn:python3.7

# set work directory
WORKDIR /app


COPY ./backend/requirements.txt /app/requirements.txt

# install dependencies
RUN apt-get -y update && apt-get install -y vim nginx

RUN    pip install -r /app/requirements.txt \
    && pip install fastapi

# copy project
COPY ./backend /app

COPY nginx.conf /etc/nginx/


COPY --from=frontend /app/frontend/build /app/discovery

RUN mkdir /var/sockets

RUN apt-get -y install gettext-base && cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.template

# --reload --workers 4 --proxy-headers 
