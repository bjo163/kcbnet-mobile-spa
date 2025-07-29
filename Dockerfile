# Use Node.js 18 Alpine as base image
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application using pnpm start
CMD ["pnpm", "start"]
