# Delilah Restó 

Este proyecto  consite en recrear una aplicación de un restaurante en la cual se encuentran las ordenes, productos y usuarios.

## Requisitos

Para el correcto funcionamiento del servidor es necesario contar con:

    - Git.
    - MySQL.
    - NodeJS.    
    - Postman (Para pruebas)

## Copia local del repositorio

Debera clonar el repositorio en una ventana de comandos en su equipo local ejecutando el siguiente comando:

```
git clone https://github.com/lssotog/Delilah_resto.git
```

## Base de datos 

Bajar el archivo db.sql y ejecutarlo en el motor de base de datos MySQL Workbench        

## Instalación

Para instalar las dependencias necesarias usamos, en la ruta del archivo package.json:

```
npm install
```
Al ejecutar este comando se instalaran las siguientes librerias

- "express": "^4.17.1",
- "jsonwebtoken": "^8.5.1",
- "mysql2": "^2.1.0",
- "sequelize": "^6.3.5",
- "swagger-jsdoc": "^4.3.0",
- "swagger-ui-express": "^4.1.4"

## Ejecutar el proyecto

Una vez instaladas todas las dependencias y que ya existe la base de datos ejecutar el siguiente comando para iniciar el servidor Express en el puerto 3010:

```
node app.js
```
       
## End points

- Login http://localhost:3010/login
- Orders admin http://localhost:3010/orders
- Productos http://localhost:3010/productos
- Usuario http://localhost:3010/usuarios
- Ordenes usuarios http://localhost:3010/ordenes 
- Status http://localhost:3010/status
- Metodos de pago http://localhost:3010/metodospago

## Postman

En la ruta Postman se encuentra la colección de peticiones para consumir los servicios del proyecto.

## Swagger

Una vez iniciado el servidor express, se puede acceder al swagger en la ruta:

```
http://localhost:3010/swagger/
```