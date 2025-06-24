FROM node:alpine AS uno

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx ng build --configuration=production


FROM nginx:alpine

WORKDIR /app

RUN rm /usr/share/nginx/html/index.html

COPY --from=uno /app/dist/guesser/browser/* /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




