# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$GEMINI_API_KEY

RUN npm run build

# Stage 2: Production
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
