FROM node:20
ENV DEBIAN_FRONTEND=noninteractive

# Copy client and server into container for building
# RUN mkdir -p /server && mkdir -p /client
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y gettext-base dos2unix make
RUN mkdir -p /opt/queuebot && mkdir -p /opt/queuebot/database
#COPY ./queuebot/migrations /server/migrations
#COPY ./queuebot/src /server/src
#COPY ./common /common
#COPY ./queuebot/nest-cli.json ./queuebot/package.json ./queuebot/package-lock.json ./queuebot/tsconfig.json ./queuebot/tsconfig.build.json ./queuebot/.env.dist /server/
COPY ./common /opt/queuebot/common
COPY ./queuebot /opt/queuebot/queuebot
# COPY ./queuebot-client /opt/queuebot/queuebot-client
COPY ./Makefile /opt/queuebot/Makefile
RUN cd /opt/queuebot && make queuebot/dist
COPY ./queuebot/run.sh /run.sh
EXPOSE 3000
CMD ["/bin/bash", "/run.sh"]
