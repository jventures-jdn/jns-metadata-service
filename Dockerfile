FROM node:bookworm-slim

WORKDIR /src

COPY . .

RUN yarn
RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start"]
