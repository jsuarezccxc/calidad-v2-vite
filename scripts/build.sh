#!/bin/sh

# Ir al directorio principal donde se encuentra el Dockerfile
cd "$(dirname "$0")/.."

# Verificando que exista el archivo para crear la imagen
if [ ! -f Dockerfile ]; then
  echo "Error: No se encontró el Dockerfile en el directorio actual."
  exit 1
fi

echo "Construyendo la imagen de Docker..."

# Construir la imagen de Docker
docker build -t react-build .

echo "Preparando la carpeta build..."

# Verificar si la carpeta build ya existe y eliminarla
if [ -d "./build" ]; then
  echo "La carpeta build ya existe. Eliminándola..."
  rm -rf ./build
fi

echo "Copiando el build generado..."

# Crear el contenedor (sin ejecutarlo)
container_temporal=$(docker create react-build)

# Copiar la carpeta build desde el contenedor al directorio local
docker cp $container_temporal:/app/build ./build

# Eliminar el contenedor temporal (sin mostrar salida)
docker rm "$container_temporal" >/dev/null 2>&1

echo "Proceso finalizado correctamente."
