FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV HATCHWAY_BASE_URL=https://api.hatchways.io/assessment/blog/posts
ENV PORT=8080
EXPOSE 8080
CMD [ "npm", "start" ]