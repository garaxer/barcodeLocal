FROM node:12-alpine
WORKDIR /app/client

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock ./
RUN yarn install 
COPY . .

CMD	 npm start

###Production
# FROM node:12 AS build
# WORKDIR /app/client
# COPY package* yarn.lock ./
# RUN yarn install
# COPY public ./public
# COPY src ./src
# RUN yarn run build

# FROM nginx:alpine
# COPY --from=build /app/client/build /usr/share/nginx/html

###Run without compose
#   docker run -it -dp 3000:3000 `
#   --network bridge `
#   -v "$(pwd):/app/client" `
#   -e CHOKIDAR_USEPOLLING=true `
#   -e REACT_APP_API_URL="http://192.168.0.5:8080/api" `
#   garybagn/barcodegen_client 



###Notes
# docker run -dp 3000:3000 `
#   -w /app -v "$(pwd):/app" `
#   node:12-alpine `
#   sh -c "yarn install && yarn start

#  docker run -it --rm `
# -v ${PWD}:/app `
# -v /app/node_modules `
# -p 3001:3000 `
# -e CHOKIDAR_USEPOLLING=true `
# client2


# Previous
# FROM	node:12.2.0-alpine
# RUN	mkdir -p /app/client
# WORKDIR	/app/client

# COPY	package.json package-lock.json /app/client/
# RUN	npm install
# COPY	./public/ /app/client/public
# COPY	./src/ /app/client/src


# Notes
# You can add another volume, say app/node_modules to use the node_modules in the container so you can work off either