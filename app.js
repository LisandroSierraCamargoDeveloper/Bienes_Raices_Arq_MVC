import  express  from  'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRutas from './routes/userRutas.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js';

//crear la app
const app = express()

// Habilitar lectura de Datos de formularios:
app.use(express.urlencoded({extended: true}))

// Habilitar cookie parser:
app.use( cookieParser() )

//Habilitar CSRF
app.use( csrf({cookie:true}) )

// Conexion a la base de Datos
try {
  await db.authenticate();
  db.sync()
 console.log('conexion correcta a la base de  datos')
}catch (error) {
  console.log(error)
}

//habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');


//carpeta publica
app.use(express.static('public'));

app.use('/', appRoutes)
app.use('/out', userRutas)
app.use('/', propiedadesRoutes)
app.use('/api',apiRoutes)

const port = process.env.PORT || 3000;
app.listen( 3000,  () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});




