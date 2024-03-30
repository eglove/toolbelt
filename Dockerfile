FROM node:20

WORKDIR /app

COPY . .

RUN npm i -g pnpm
RUN pnpm i

EXPOSE 51204

RUN pnpm test:ui
