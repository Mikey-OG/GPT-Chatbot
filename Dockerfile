# Use the official Node.js image as the base image
FROM node:15.13-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies, including Yarn
RUN npm install

COPY .env .env
# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your app will run on during development
EXPOSE 3000

# Command to run the application in development mode
CMD ["npm", "run", "dev"]