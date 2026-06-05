FROM node:18

ADD . /backend-oic
WORKDIR /backend-oic

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY cert* ./certs/

RUN npm install -g pnpm@9
RUN pnpm install
COPY . .

RUN pnpm run build

CMD [ "node", "dist/main" ]