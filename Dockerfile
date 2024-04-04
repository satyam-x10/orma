FROM node:lts-alpine

EXPOSE 5173

USER node

RUN mkdir -p /home/node/app


WORKDIR /home/node/app
COPY ./package.json .
RUN yarn install

CMD [ "yarn", "run", "dev" ]