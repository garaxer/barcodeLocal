# Not using alpine as I need bash
FROM node:12 
WORKDIR /app/server
COPY package.json yarn.lock ./
RUN yarn install 
COPY . .
RUN apt update
# RUN wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.stretch_amd64.deb
RUN apt install -y ./wkhtmltox_0.12.6-1.stretch_amd64.deb
CMD	yarn run start:docker

#useless functions
#RUN apk add wkhtmltopdf
#RUN apt-get install -y wkhtmltopdf


#Run it without compose
# docker build -t IMAGENAME
# docker run -dp 8080:8080 IMAGENAME
# Powershell

#  docker run -dp 8080:8080 `
#  --network bridge `
#    -v "$(pwd):/app/server" `
#      -e  JWT_KEY=Yourkey `
#      -e  PORT=8080 `
#      -e  DATABASE_URL=postgres://postgres:test123!@host.docker.internal:5432/postgres `
#      garybagn/barcodegen 

##names:
#garybagn/barcodegen_client
#garybagn/barcodegen  

# Remember these useful commands
# docker network create barcode-app
# network barcode-app --network-alias server `
# docker image ls
# docker image prune # removes old ones
# docker ps -a
# docker logs -f container_id
# docker tag client garybagn/barcodegen_client
# docker tag server garybagn/barcodegen  
# Connect to the database psql -h localhost -U postgres -d postgres

## Run the database
# docker run --rm   --name pg-docker -e POSTGRES_PASSWORD=test123! -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data  postgres

#docker run --rm   --name pg-docker2 -e POSTGRES_PASSWORD=test123! -d -p 5432:5432 -v C:\Users\Gary\docker\volumes\postgres:/var/lib/postgresql/data  postgres

#
# previous version
#
# FROM	node:12.2.0-alpine
# RUN	mkdir -p /app/server
# WORKDIR	/app/server

# COPY	./ /app/server/
# RUN	npm install

# CMD	npm start