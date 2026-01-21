# Variables
IMAGE_NAME-react-build
BUILD_DIR=build
APP_PATH=..

.PHONY: deploy clean build help

# Comando principal de despliegue (desde Jenkins)
deploy: clean build

# Elimina la carpeta build anterior si existe (limpieza previa al build)
clean:
	@echo "🧹 Limpiando carpeta build anterior..."
	@rm -rf $(APP_PATH)/$(BUILD_DIR)

# Construye la imagen y extrae la carpeta build desde el contenedor
build:
	@echo "🔧 Verificando existencia del Dockerfile..."
	@if [ ! -f $(APP_PATH)/Dockerfile ]; then \
		echo "❌ Error: No se encontró el Dockerfile en $(APP_PATH)"; \
		exit 1; \
	fi
	@echo "🐳 Construyendo la imagen Docker..."
	@docker build -t $(IMAGE_NAME) $(APP_PATH)

	@echo "📤 Extrayendo la carpeta '$(BUILD_DIR)' del contenedor..."
	@container_id=$$(docker create $(IMAGE_NAME)); \
	docker cp $$container_id:/app/$(BUILD_DIR) $(APP_PATH)/$(BUILD_DIR); \
	docker rm $$container_id >/dev/null
	@echo "✅ Build completado correctamente. Carpeta '$(BUILD_DIR)' lista para transferir."
	
# Muestra ayuda para frontend
help:
	@echo "🎯 Comandos disponibles para frontend React:"
	@echo "  make deploy     -> Elimina carpeta build anterior y genera nuevo build listo para copiar"
	@echo "  make clean      -> Elimina solo la carpeta build"
	@echo "  make build      -> Construye imagen y extrae carpeta build desde contenedor"
