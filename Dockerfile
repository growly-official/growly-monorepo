# Use a specific Node.js version for better reproducibility
FROM node:23.3.0-slim AS builder

# Install pnpm globally and install necessary build tools
RUN npm install -g bun && \
    apt-get update && \
    apt-get install -y git python3 make g++ && \
    apt-get clean && \
    rm -rf node_modules && \ 
    rm -rf /var/lib/apt/lists/*

# Set Python 3 as the default python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Copy core
COPY ./packages/core/ ./packages/core

# Copy agent
COPY ./apps/agent/package.json ./apps/agent/package.json
COPY ./apps/agent/src ./apps/agent/src
COPY ./apps/agent/tsconfig.json ./apps/agent/tsconfig.json

# Copy package.json and other configuration files
COPY package.json ./
COPY bun.lockb ./

# Install dependencies and build the project
RUN bun install 
RUN bun run build 

# Create dist directory and set permissions
RUN mkdir -p /apps/agent/dist && \
    chown -R node:node /apps/agent && \
    chmod -R 755 /apps/agent

EXPOSE 3000 3005
# Set the command to run the application
CMD ["bun", "start", "--non-interactive"]


# # Switch to node user
# USER node

# # Create a new stage for the final image
# FROM node:23.3.0-slim

# # Install runtime dependencies if needed
# RUN npm install -g bun
# RUN apt-get update && \
#     apt-get install -y git python3 && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # Copy built artifacts and production dependencies from the builder stage
# COPY --from=builder /package.json /app/
# COPY --from=builder /node_modules /app/node_modules
# COPY --from=builder /apps/agent/ /app/apps/agent/
# COPY --from=builder /packages/core/ /app/packages/core/
# COPY --from=builder /bun.lockb /app/

# EXPOSE 3000 3005
# # Set the command to run the application
# CMD ["bun", "start", "--non-interactive"]
