FROM node:20

WORKDIR /app

COPY . .

RUN npm i -g bun
RUN bun i

EXPOSE 51204

RUN bun test:ui
