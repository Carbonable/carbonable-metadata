FROM node:19-alpine3.16

ENV NODE_ENV production

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

LABEL fly_launch_runtime="nodejs"

CMD [ "npm", "run", "start" ]
