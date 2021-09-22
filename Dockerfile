FROM node:14-alpine AS build

USER node
RUN mkdir /home/node/node-express-kubernetes-example/ && chown -R node:node /home/node/node-express-kubernetes-example
WORKDIR /home/node/node-express-kubernetes-example

COPY --chown=node:node . .
RUN yarn install --frozen-lockfile && yarn build

FROM node:14-alpine

USER node
EXPOSE 3001

RUN mkdir /home/node/node-express-kubernetes-example/ && chown -R node:node /home/node/node-express-kubernetes-example
WORKDIR /home/node/node-express-kubernetes-example

COPY --chown=node:node --from=build /home/node/node-express-kubernetes-example/dist ./dist
COPY --chown=node:node --from=build /home/node/node-express-kubernetes-example/package.json /home/node/node-express-kubernetes-example/yarn.lock ./
RUN yarn install --frozen-lockfile --production

CMD [ "node", "dist/index.js" ]
