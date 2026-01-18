# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq -o Acquire::Retries=5 && \
    apt-get install -y --no-install-recommends --fix-missing -o Acquire::Retries=5 \
    python3 make g++ pkg-config \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY --link . .

# Install node modules
COPY --link package.json ./
RUN npm install --include=dev

# Build application
RUN npm run common:build
RUN npm run server:build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Install runtime libraries needed by canvas
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq -o Acquire::Retries=5 && \
    apt-get install -y --no-install-recommends --fix-missing -o Acquire::Retries=5 \
    libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libjpeg62-turbo libgif7 librsvg2-2 libpixman-1-0 && \
    rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD [ "npm", "run", "server:start" ]
