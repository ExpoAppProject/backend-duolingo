FROM node:20.16.0-bookworm-slim

WORKDIR /app

RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y openssl \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
