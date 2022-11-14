FROM node:16.10.0

ADD . /backend-oic
WORKDIR /backend-oic

COPY ["package.json","./certs","./"]

RUN npm install
COPY . .

RUN npm run build

CMD [ "node", "dist/main" ]