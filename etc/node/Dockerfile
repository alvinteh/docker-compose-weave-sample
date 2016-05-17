FROM alvinteh/docker-dev-node:latest

MAINTAINER "Alvin Teh" <i@alvinteh.me>

WORKDIR /var/www/app

CMD npm run build && pm2 start ../etc/process.json --no-daemon
