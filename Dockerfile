ARG NODE_VERSION=16
ARG APP_DIR=/app



FROM node:$NODE_VERSION AS build

# Install dependencies
WORKDIR /build
COPY package.json yarn.lock .
RUN yarn install

# Copy source code
COPY tsconfig.json .
COPY src/ src/

# Transpile Typescript
RUN yarn build

# Runtime stage
FROM node:$NODE_VERSION

ARG APP_DIR
WORKDIR $APP_DIR

RUN npm install pm2 -g
COPY --from=build /build/node_modules node_modules
COPY --from=build /build/dist/ .

CMD ["pm2-runtime", "infrastructure/bot.js"]

LABEL org.opencontainers.image.source=https://github.com/rasouza/gamepass-bot
LABEL org.opencontainers.image.description="Discord Bot that announces game offers from platforms"