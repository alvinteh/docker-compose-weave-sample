Setting up Docker, Docker Compose and Weave as Services on CoreOS
=========

The following steps were tested on CoreOS.

Step 1: Install Docker Compose
------
- Create and execute the following script:
```
#!/bin/bash
mkdir -p /opt/bin
curl -L `curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r '.assets[].browser_download_url | select(contains("Linux") and contains("x86_64"))'` > /opt/bin/docker-compose
chmod +x /opt/bin/docker-compose
```

Step 2: Set up the Weave service
------
- Create the Weave Installer service `/etc/systemd/system/install-weave.service`:
```
[Unit]
After=network-online.target
After=docker.service
Description=Install Weave
Requires=network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStartPre=/usr/bin/wget -N -P /opt/bin https://raw.github.com/weaveworks/weave/master/weave
ExecStartPre=/usr/bin/chmod +x /opt/bin/weave
ExecStartPre=/usr/bin/docker pull weaveworks/weave:latest
ExecStart=/bin/echo Weave Installed
```

- Create the Weave service `/etc/systemd/system/weave.service`:
```
[Unit]
After=install-weave.service
Description=Weave Network
Requires=install-weave.service

[Service]
EnvironmentFile=/etc/weave.%H.env
ExecStartPre=/opt/bin/weave launch $WEAVE_LAUNCH_ARGS
ExecStart=/usr/bin/docker logs -f weave
SuccessExitStatus=2
ExecStop=/opt/bin/weave stop
```

Step 3: Set up other Weave prerequisite files
------
- Create the Weave network `/etc/systemd/network/10-weave.network`:
```
[Match]
Type=bridge
Name=weave*

[Network]
```

- Create the launch environment arguments file `/etc/weave.X.env` (replace X with the current machine's hostname)
```
WEAVE_LAUNCH_ARGS=""
```
- If you are using a secondary host (i.e. a Weave "cluster", set `WEAVE_LAUNCH_ARGS` to the hostname of the primary host.)

Step 4: Start Weave
------
- Start the Weave service by running `sudo systemctl start weave.service`.
- Initialize environment variables required by Weave (primarily `DOCKER_HOST`) by running `eval $(weave env)`.
- Remember to initialize the environment variables *each time you connect to the host*.

