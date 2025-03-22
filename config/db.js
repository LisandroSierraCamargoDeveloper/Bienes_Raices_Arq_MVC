import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASSWORD ?? '', {
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,
  dialect: 'mysql',
  define: {
    timestamps: true,
    // Eliminar operatorAliases, ya no es necesario en Sequelize v6+
  },
  pool: {
    max: 10, // Aumentar el maximo de conexiones
    min: 0,
    acquire: 30000, // Aumentar el tiempo de adquisición para evitar errores prematuros
    idle: 10000,
    evict: 10000, // Añadir evict para limpiar las conexiones inactivas
    acquireTimeout: 60000, // Tiempo máximo de espera para adquirir una conexión
    maxUses: 100, // Limitar el número de veces que una conexión puede ser utilizada
  },
  // Eliminar operatorAliases, ya no es necesario en Sequelize v6+
  timezone: '+00:00', // Configurar la zona horaria para consistencia
});

export default db;