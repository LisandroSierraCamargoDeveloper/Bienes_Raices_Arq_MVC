import  express  from  'express'
import { formularioLogin , autenticar, cerrarSesion, formularioRegistro ,registrar, confirmar, formularioOlvidePassword ,resetPassword , comprobarToken , nuevoPassword} from '../controller/usuariosController.js'
const router  = express.Router();

     
//Paso Uno Crear la Ruta hacia donde te va a Redirigir
router.get('/login', formularioLogin)
router.post('/login', autenticar);//nuevo


//cerrar Sesión:
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', formularioRegistro )

router.post('/registro', registrar )

router.get('/confirmar-cuenta/:token', confirmar )


//olvidé mi password:
router.get('/olvide-password', formularioOlvidePassword )
router.post('/olvide-password', resetPassword )

// Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);



export default router
    
