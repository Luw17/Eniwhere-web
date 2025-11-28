FROM node:20 AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]