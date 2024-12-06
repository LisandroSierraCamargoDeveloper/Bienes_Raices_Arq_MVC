import express from 'express'
import { inicio, categoria , noEncontrado , buscador } from "../controller/appController.js"

const router = express.Router()



//Pagina de Inicio

router.get('/',inicio)

//Pagina Categorias

router.get('/categorias/:id',categoria)


//Pagina 404
router.get('/404', noEncontrado)

//Buscardor
router.post('/buscador', buscador)



export default router;