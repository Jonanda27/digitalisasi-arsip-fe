# --- STAGE 1: BUILDER ---
FROM node:20-alpine as builder
WORKDIR /app

# Install dependency
COPY package*.json ./
# Batasi memori Node.js agar VPS tidak hang saat nge-build
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm install

# Copy semua source code
COPY . .

# Tangkap argumen URL dari docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Eksekusi build (akan menghasilkan folder /dist)
RUN npm run build

# --- STAGE 2: SERVE (SUPER RINGAN) ---
FROM nginx:alpine

# Pindahkan hasil build ke web server Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Konfigurasi Nginx internal agar routing SPA (Vite) tidak error 404 saat direfresh
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
