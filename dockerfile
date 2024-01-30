# Usa una imagen base de Node.js
FROM node:latest

# Crea y establece el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que tu aplicación se ejecutará
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["npm", "run", "dev"]
