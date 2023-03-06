FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

# RUN npx prisma migrate dev --name init

# RUN npx prisma db seed

EXPOSE 5001

CMD [ "npm", "run", "dev" ]