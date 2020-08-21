# Check out https://hub.docker.com/_/node to select a new base image
FROM node:14.5.0-alpine

# create and set app directory
ARG CODE_SOURCE=/home/node/aws-ecs-getting-started
RUN mkdir -p $CODE_SOURCE
WORKDIR $CODE_SOURCE

# Bundle app source
COPY . $CODE_SOURCE

# Build aws-ecs-getting-started
RUN npm install

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=4000

EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]