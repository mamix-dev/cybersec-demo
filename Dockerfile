# Dockerfile
FROM node:20

# Install MySQL client
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files and wait-for-db script
COPY . .
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod 777 /wait-for-db.sh

# Use the wait-for-db script
CMD ["/wait-for-db.sh","node", "server.js"]
