FROM node

RUN mkdir app

WORKDIR app

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 8080

CMD npm run serve
