# Usar una imagen de Node.js como base
FROM node:14.18.1-slim

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Eliminar yarn preinstalado (si existe) para evitar errores de symlink
RUN rm -f /usr/local/bin/yarn /usr/local/bin/yarnpkg \
  && npm install -g yarn@1.22.22

# Copiar package.json y yarn.lock antes de instalar dependencias
COPY package.json yarn.lock ./

# Instalar dependencias usando yarn.lock del repositorio
RUN yarn install --frozen-lockfile

# Copiar todo el código fuente
COPY . .

# Ejecutar el proceso de build de React
RUN yarn build-prod
