FROM node:20-bookworm-slim

WORKDIR /opt/app

RUN npm config set fund false \
  && npm config set audit false

COPY package.json ./

EXPOSE 1337

CMD ["sh", "-c", "if [ ! -d node_modules/@strapi/strapi ]; then npm install; fi && npm run develop"]