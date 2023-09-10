FROM node:18
ENV DEBIAN_FRONTEND=noninteractive

# Copy client and server into container for building
# RUN mkdir -p /server && mkdir -p /client
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y gettext-base dos2unix
RUN mkdir -p /server
COPY ./migrations /server/migrations
COPY ./src /server/src
COPY ./nest-cli.json ./package.json ./package-lock.json ./tsconfig.json ./tsconfig.build.json ./.env.dist /server/
RUN cd /server && npm ci && touch /server/queuebot.db
COPY run.sh /run.sh
EXPOSE 3000
CMD ["/bin/bash", "/run.sh"]
