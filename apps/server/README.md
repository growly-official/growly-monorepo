## Chainsmith Server

### Requirements

- NodeJS: 19.0.0

### Technical stack

- TypegraphQL
- GraphQL
- Firebase SDK Admin
- NodeJS

### Docker image

#### Build docker image

Building the image that is compatible with both Intenl and AMD64 chip.

```
docker buildx build --platform linux/amd64 -t chainsmith-prod:amd64 .
```

#### Run docker image locally

```
docker run --env-file ./.env --publish 8080:8080 chainsmith-server
```

#### Run docker image remotely

```
docker run -it --name chainsmith-server --env-file .env -d --restart always registry.digitalocean.com/chainsmith-prod/chainsmith-server
```

Required an approriate .env file to work.

#### Development & Production .env

```
OPENAI_API_KEY=
OPENAI_ORGANIZATION=

FIREBASE_SECRET={"private_key":"FIREBASE_PRIVATE_KEY","client_email":"FIREBASE_CLIENT_EMAIL","project_id":"FIREbASE_PROJECT_ID"}

SERVER_PORT=8080
```

### Nginx & SSL .env

```
VIRTUAL_PORT=8080
VIRTUAL_HOST=api.chainsmith.io
LETSENCRYPT_HOST=api.chainsmith.io
LETSENCRYPT_EMAIL=team@chainsmith.io
```

### Deploy to digital ocean

#### Push docker image to Digital Ocean

Authorize your digital ocean account with access token and deploy

```
doctl auth init --context Chainsmith-Infra => Enter access token
docker tag chainsmith-prod registry.digitalocean.com/chainsmith/chainsmith-prod
docker push registry.digitalocean.com/chainsmith/chainsmith-prod
```

## Configure production environment

Resource: https://200lab.io/blog/docker-nginx-lets-encrypt-web-service-ssl/

Server is configured and running on Digital Ocean droplet

### Install dependencies for Nginx

```
sudo apt-get update

sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Why Nginx? We need Nginx for automated proxy. It routes defined port to the mapped port when running Nginx docker image.

### Boot Container Nginx

Define ports after flag -p. For example `-p 8080:8080`. In this case, we use Nginx as a reverse proxy to redirect the web request.

```
docker run -d -p 80:80 -p 443:443 --name nginx-proxy  --privileged=true \
  -e ENABLE_IPV6=true \
  -v ~/nginx/vhost.d:/etc/nginx/vhost.d \
  -v ~/nginx-certs:/etc/nginx/certs:ro \
  -v ~/nginx-conf:/etc/nginx/conf.d \
  -v ~/nginx-logs:/var/log/nginx \
  -v /usr/share/nginx/html \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  jwilder/nginx-proxy
```

### Container web server

After the container Nginx boot, run the command from above section to run the server docker image remotely (Remember to configure the `.env` with a correct variables).

### Configure free SSL using Let's Encrypt

The purpose of the below docker container is to watch every docker containers running and it works with the Nginx container above to authorize domain with SSL certificate.

```
docker run -d --privileged=true \
  -v ~/nginx/vhost.d:/etc/nginx/vhost.d \
  -v ~/nginx-certs:/etc/nginx/certs:rw \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --volumes-from nginx-proxy \
  jrcs/letsencrypt-nginx-proxy-companion
```

NOTE: Don't require cron-job to revalidate the certificate, the container has a mechanism to handle that already.
