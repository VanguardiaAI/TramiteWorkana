FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Segunda etapa con una imagen limpia
FROM nginx:alpine

# Copiar los archivos compilados de la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 