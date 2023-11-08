FROM node:8.11.4
# Create app directory
WORKDIR /app

RUN npm i -g pm2

COPY package*.json ./
RUN npm install
COPY . .

ENV HOST 0.0.0.0
EXPOSE 3000

# start command
# CMD ["pm2", "start", "-i", "1", "--name", "server", "index.js"]
CMD ["node", "index.js"]
