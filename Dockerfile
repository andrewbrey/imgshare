###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

WORKDIR /workspace

RUN apk add perl exiftool git sudo imagemagick

RUN echo node ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

COPY --chown=node:node ./package*.json ./

RUN npm ci && chown -R node:node /workspace/node_modules

COPY --chown=node:node . .

USER node

RUN mkdir -p public/uploads/small/

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /workspace

COPY --chown=node:node ./package*.json ./

COPY --chown=node:node --from=development /workspace/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

WORKDIR /imgshare

RUN apk add perl exiftool imagemagick

COPY --chown=node:node --from=build /workspace/node_modules ./node_modules
COPY --chown=node:node --from=build /workspace/public ./public
COPY --chown=node:node --from=build /workspace/dist ./dist

USER node

RUN mkdir -p public/uploads/small/

CMD [ "node", "dist/main.js" ]
