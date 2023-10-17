# -----------------------------------------------------------------------------
# This stage builds the build container.
# -----------------------------------------------------------------------------

FROM node:18.18.2-alpine3.17 as build

# Paths
ARG IMS_SOURCE_DIR="/src/ims"
ARG IMS_SERVER_ROOT="/srv/ims"

# Build application

WORKDIR "${IMS_SOURCE_DIR}"

COPY ./package-lock.json ./
COPY ./package.json      ./

RUN npm ci

COPY ./COPYRIGHT.txt ./
COPY ./LICENSE.txt   ./
COPY ./README.md     ./
COPY ./public/       ./public/
COPY ./src/          ./src/

RUN npm run build
RUN mv ./build "${IMS_SERVER_ROOT}"


# -----------------------------------------------------------------------------
# This stage builds the application container.
# -----------------------------------------------------------------------------

FROM nginx:1.21.4-alpine as application

# Add Tini, which handles signals that Node does not handle well, see:
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
# https://github.com/krallin/tini#using-tini
#RUN apk add --no-cache tini
#ENTRYPOINT [ "/sbin/tini", "--" ]

# Paths
ARG IMS_SERVER_ROOT="/srv/ims"

# Copy build result
COPY --from=build "${IMS_SERVER_ROOT}" "${IMS_SERVER_ROOT}"

# Set working directory to document root
WORKDIR "${IMS_SERVER_ROOT}"

# Replace Nginx default site config
COPY ./docker/nginx-default.conf /etc/nginx/conf.d/default.conf
