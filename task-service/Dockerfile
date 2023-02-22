FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./

COPY .env ./

COPY tsconfig.json ./

COPY . .

RUN npm install

RUN npx prisma generate

# RUN npx prisma migrate dev

EXPOSE 5000

CMD [ "npm", "run", "dev" ]