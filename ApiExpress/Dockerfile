
FROM node:18-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon && \
    npm install -g react-scripts

EXPOSE 3000

CMD ["npm", "run", "start"]