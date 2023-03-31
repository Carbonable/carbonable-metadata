FROM node:19-alpine3.16

ENV NODE_ENV production

WORKDIR /app

COPY . .

RUN npm install

LABEL fly_launch_runtime="nodejs"

CMD [ "npm", "run", "start" ]
