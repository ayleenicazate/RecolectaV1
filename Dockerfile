# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias (package.json y package-lock.json) al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación al contenedor
COPY . .

# Expone el puerto en el que corre la app (ajusta el puerto si es necesario)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "3000"]
