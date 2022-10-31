# Dockerfile
FROM node:18-alpine As development
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/
RUN npm install glob rimraf
RUN npm install
COPY --chown=node:node . .
RUN npm run build

USER node

FROM node:18-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/
RUN npm install glob rimraf
RUN npm install --only=production
COPY --chown=node:node . .
COPY --chown=node:node --from=development /usr/src/app/dist ./dist
CMD [“node”, “dist/main”]