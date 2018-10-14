FROM mhart/alpine-node:8

ENV NODE_ENV=production

RUN mkdir -p /usr/src/host
WORKDIR /usr/src/host

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --ignore-engines --pure-lockfile

# Add your source files
COPY . /usr/src/host

CMD ["yarn","start"]
