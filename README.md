docker-compose-weave-sample
=========

Sample multi-container (PHP, node, MySQL) app utilizing Docker Compose and Weave

Usage
-------
1. Install Docker and Docker Compose. If you are using a Windows/Mac OS X machine, install Docker Machine as well (all of the required Docker components can be installed together as part of the [Docker Toolbox](https://www.docker.com/products/docker-toolbox)).

2. Install [Weave](https://www.weave.works/).

3. Start Weave by running `weave launch`.

4. Initialize environment variables (specifically `DOCKER_HOST`) required by Weave by running `eval $(weave env)`.

5. Clone this repository.

6. Start the app by running `docker-compose up` in the repository root folder.

7. Expose the app containers to the host by running `weave expose`.

8. If you would like to be able to use the container hostnames on the host as well, add the Weave DNS server. On Linux, this can be done by running `sudo echo nameserver 172.17.0.1 >> /etc/resolv.conf`. On some systems such as CoreOS, `/etc/resolv.conf` is a symlink, so create a static copy of it before adding the nameserver to ensure your changes will not be overriden.

9. (Optional) If you would like to expose the app to the public, create another nginx app to serve as a proxy. A sample nginx configuration which exposes the PHP and node containers under `/sample_php` and `/sample_node` is as follows:

```
server {
    listen 80;

    location ~ ^/sample_node(.*) {
        rewrite ^/sample_node(/?)(.*)$ /$2 break;
        proxy_pass http://sample-node;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $https;
    }

    location ~ ^/sample_php(.*) {
        rewrite ^/sample_php(/?)(.*)$ /$2 break;
        proxy_pass http://sample-php;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $https;
    }
}
```

10. Enjoy the app! First initialize the database by browsing http://node-sample/init, and then populate it with rows by browsing http://node-sample/populate. Once that is done, visit http://node-sample or http://php-sample.

License
-------
Copyright 2016 Alvin Teh.
Licensed under the MIT license.
