FROM node:16-alpine AS build

WORKDIR /home/node

COPY . .
RUN yarn install --frozen-lockfile && yarn build

FROM node:16-alpine

RUN addgroup --gid 3000 --system juffgroup \
  && adduser  --uid 2000 --system --ingroup juffgroup juffuser

USER 2000:3000

RUN mkdir /home/juffuser/node-express-kubernetes-example/
WORKDIR /home/juffuser/node-express-kubernetes-example

COPY --from=build /home/node/dist ./dist
COPY --from=build /home/node/public ./public
COPY --from=build /home/node/package.json /home/node/yarn.lock ./
RUN yarn install --frozen-lockfile --production

EXPOSE 3001

CMD [ "node", "dist/index.js" ]
