FROM node:alpine AS uno

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

RUN npm install -g typescript

COPY . .

RUN ng build --configuration=production

FROM nginx:alpine AS dos

WORKDIR /app

RUN rm /usr/share/nginx/html/index.html

COPY --from=uno /app/dist/guesser/browser/* /usr/share/nginx/html
COPY --from=uno /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




