FROM node:23

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080 3000 4000 5001

CMD ["node", "server.js"]
