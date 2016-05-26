FROM andrewmclagan/nginx-hhvm:latest

MAINTAINER "Alvin Teh" <i@alvinteh.me>

WORKDIR /var/www/app

RUN sed -i -- 's/public/app/g' /etc/nginx/sites-enabled/default
