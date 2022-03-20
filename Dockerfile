ARG NODE_VERSION=16
ARG APP_DIR=/app

FROM node:$NODE_VERSION

ARG APP_DIR
WORKDIR $APP_DIR

RUN npm install pm2 -g
COPY dist/ .
COPY package.json .

RUN yarn --production --force
CMD ["pm2-runtime", "bot.js"]
