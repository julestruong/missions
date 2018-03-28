FROM node:9.8.0

WORKDIR .

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8088

CMD npm start