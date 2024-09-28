# Use a multi-stage build to reduce final image size

# Stage 1: Build the React app
FROM node:14 as react-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN npm install --prefix frontend
COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# Stage 2: Build the backend
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY --from=react-build /app/frontend/build ./frontend/build

EXPOSE 8081
CMD ["node", "server.js"]
