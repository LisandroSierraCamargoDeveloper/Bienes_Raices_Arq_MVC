import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASS ?? '',
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT || 3306, // Usa BD_PORT si está definido, sino 3306
    dialect: 'mysql',
    define: {
      timestamps: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: { // Important for render.
      connectTimeout: 60000, // 60 seconds. Adjust as needed.
    },
    operatorAliases: false,
  }
);

// Función para probar la conexión
async function testConnection() {
  try {
    await db.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

// Ejecuta la prueba de conexión al iniciar
testConnection();

export default db;