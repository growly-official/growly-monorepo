# Use a specific Node.js version for better reproducibility
FROM node:23.7.0-slim AS builder

# Install pnpm globally and install necessary build tools
RUN npm install -g bun && \
    apt-get update && \
    apt-get install -y git python3 make g++ && \
    apt-get clean && \
    rm -rf node_modules && \ 
    rm -rf /var/lib/apt/lists/*

# Set Python 3 as the default python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set the working directory
WORKDIR /app
# Copy core
COPY ./packages/core/ ./packages/core

# Copy agent
COPY ./apps/agent/package.json ./apps/agent/package.json
COPY ./apps/agent/src ./apps/agent/src
COPY ./apps/agent/tsconfig.json ./apps/agent/tsconfig.json

# Copy server
COPY ./apps/server/package.json ./apps/server/package.json
COPY ./apps/server/src ./apps/server/src
COPY ./apps/server/tsconfig.json ./apps/server/tsconfig.json
COPY ./apps/server/tsconfig.build.json ./apps/server/tsconfig.build.json

# Copy package.json and other configuration files
COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.base.json ./

# Install dependencies and build the project
RUN bun install 
# RUN bun run build 

# Create dist directory and set permissions
RUN chown -R node:node /app && \
    chmod -R 755 /app

# Create a new stage for the final image
FROM node:23.3.0-slim

# Install runtime dependencies if needed
RUN npm install -g bun
RUN apt-get update && \
    apt-get install -y git python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built artifacts and production dependencies from the builder stage
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/tsconfig.base.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/agent/ /app/apps/agent/
COPY --from=builder /app/apps/server/ /app/apps/server/
COPY --from=builder /app/packages/core/ /app/packages/core/

EXPOSE 3000 3005
