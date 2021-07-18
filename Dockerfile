ARG NODE_VERSION=16
ARG APP_DIR=/app

FROM node:$NODE_VERSION

ARG APP_DIR
WORKDIR $APP_DIR

RUN npm install pm2 -g
COPY dist/ .
CMD ["pm2-runtime", "bin/bot.js"]
