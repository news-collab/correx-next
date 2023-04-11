FROM debian:11-slim
ARG uid=2000
RUN adduser --gecos '' -u $uid --disabled-password dev
RUN mkdir /home/dev/app && chown dev:dev /home/dev/app
RUN apt update && apt upgrade -y && apt install -y curl build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt update && apt install -y nodejs build-essential
WORKDIR /home/dev/app
USER dev
