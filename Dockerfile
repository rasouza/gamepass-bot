ARG NODE_VERSION=16
ARG APP_DIR=/app

# Creates the builder image and fetch dependencies
FROM node:$NODE_VERSION as build

ARG APP_DIR
WORKDIR $APP_DIR

COPY package.json yarn.lock ./
RUN yarn install
COPY . .


# # Build the app
# FROM node:$NODE_VERSION as release

# ARG APP_DIR
# WORKDIR $APP_DIR

# COPY --from=build $APP_DIR/dist .

# RUN npm install -g pm2

# CMD ["pm2-runtime", "bot.js"]