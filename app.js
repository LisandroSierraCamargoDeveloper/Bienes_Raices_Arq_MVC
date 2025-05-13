import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRutas from './routes/userRutas.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Función principal
const startServer = async () => {
  try {
    // Conexión a la base de datos
    await db.authenticate();
    await db.sync();
    console.log('✅ Conexión correcta a la base de datos');

    // Middlewares
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(csrf({ cookie: true }));

    // Carpeta pública
    app.use(express.static('public'));

    // Configurar pug
    app.set('view engine', 'pug');
    app.set('views', './views');

    // Rutas
    app.use('/', appRoutes);
    app.use('/auth', userRutas);
    app.use('/', propiedadesRoutes);
    app.use('/api', apiRoutes);

    // Levantar servidor
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 El servidor está funcionando en el puerto ${port}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

// Cerrar conexiones al finalizar proceso
const closeConnection = async (signal) => {
  try {
    await db.close();
    console.log(`🔌 Conexión cerrada por ${signal}`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ Error cerrando la conexión:`, err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => closeConnection('SIGTERM'));
process.on('SIGINT', () => closeConnection('SIGINT'));
