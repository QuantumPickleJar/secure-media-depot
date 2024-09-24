# Use Node.js base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
