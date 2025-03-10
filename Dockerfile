# Builder image
FROM node:22.14-alpine AS builder
# Change the working directory to /app
WORKDIR /app
# Copy files required to build the application
COPY package*.json tsconfig.* ./
RUN npm install
# Copy the sources
COPY src ./src/

# Build the application (leaves result on ./dist)
RUN npm run build
# Execute `npm ci` (not install) for production with an externally mounted npmrc
RUN npm ci --omit=dev --ignore-scripts

# Production image
FROM node:22.14-alpine AS service
# Set the NODE_ENV value from the args
ARG NODE_ENV=production
# Export the NODE_ENV to the container environment
ENV NODE_ENV=${NODE_ENV}
# For security reasons don't run as root
USER node
# Change the working directory to /app
WORKDIR /app
# Copy files required to run the application
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
# Copy the dist folder from the builder
COPY --chown=node:node --from=builder /app/dist ./dist

# Container command
CMD ["node", "/app/dist/main"]