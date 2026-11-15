-- 1. Creación y selección de la base de datos
CREATE DATABASE IF NOT EXISTS transporte_tp3;
USE transporte_tp3;

-- 2. Tabla de Usuarios (para autenticación con JWT y bcrypt)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL -- Guardará el hash generado por bcrypt
);

-- 3. Tabla de Vehículos
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    patente VARCHAR(15) NOT NULL UNIQUE,
    anio INT NOT NULL,
    capacidad_carga DECIMAL(10, 2) NOT NULL -- Ej: en kg o toneladas
);

-- 4. Tabla de Conductores
CREATE TABLE conductores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    numero_licencia VARCHAR(30) NOT NULL UNIQUE,
    fecha_alta_licencia DATE NOT NULL,
    fecha_vencimiento_licencia DATE NOT NULL
);

-- 5. Tabla de Viajes (con claves foráneas a vehículos y conductores)
CREATE TABLE viajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    conductor_id INT NOT NULL,
    fecha_salida DATETIME NOT NULL,
    fecha_llegada DATETIME NOT NULL,
    origen VARCHAR(150) NOT NULL,
    destino VARCHAR(150) NOT NULL,
    kilometros DECIMAL(10, 2) NOT NULL,
    observaciones TEXT,
    
    -- Restricciones de integridad referencial
    CONSTRAINT fk_viaje_vehiculo 
        FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_viaje_conductor 
        FOREIGN KEY (conductor_id) REFERENCES conductores(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);conductores