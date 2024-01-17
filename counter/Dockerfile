FROM node:19.8-alpine

WORKDIR /app

ARG NODE_ENV=production

COPY ./package*.json ./
RUN npm i
COPY ./src src/

CMD ["npm", "run", "server"]