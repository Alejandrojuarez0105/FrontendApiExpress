# Etapa 1: Construcción
FROM node:18-alpine AS build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (o pnpm/yarn lock si aplica)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente al contenedor
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS production-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar 'serve' globalmente para servir los archivos estáticos
RUN npm install -g serve

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=build-stage /app/build /app/build

# Exponer el puerto 3000 (por defecto en 'serve')
EXPOSE 3001

# Ejecutar el servidor
CMD ["serve", "-s", "build", "-l", "3001"]
