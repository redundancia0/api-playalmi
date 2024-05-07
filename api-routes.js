/* ESTABLECER API-ROUTES COMO ROUTER */
let router = require('express').Router();

/* RUTA BASE PARA COMPROBAR SU FUNCIONAMIENTO */
router.get('/', function(req, res)
{
    res.json({
        status: 'Api trabajando',
        message: '---> FUNCIONANDO <----'
    });
});

/* CONTROLADOR -> TODAS LAS RUTAS DE LA API */
var playalmiController = require('./playalmiController')

/* RUTA "/USUARIOS" (.GET, .DELETE, .POST): OBTENER, ELIMINAR O CREAR TODOS LOS USUARIOS */
router.route('/usuarios')
    .get(playalmiController.obtenerUsuarios)
    .delete(playalmiController.eliminarUsuarios)
    .post(playalmiController.crearUsuario)

/* RUTA "/USUARIOS/FINDBYID" (.GET, .DELETE, .PUT): OBTENER INFORMACIÓN, ELIMINAR O MODIFICAR USUARIO */
router.route('/usuarios/findbyid/:usuario_id')
    .get(playalmiController.verUsuario)
    .delete(playalmiController.eliminarUsuario)
    .put(playalmiController.actualizarUsuario)

/* RUTA "/PARTIDAS/TOP" (.GET): OBTENER LAS MEJORES PARTIDAS DE LOS JUGADORES */
router.route('/partidas/top') 
    .get(playalmiController.topUsuarios)

/* RUTA "/USUARIOS/INCREMENTARPUNTOS" (.POST): INCREMENTAR LOS PUNTOS DE UN USUARIO */
router.route('/usuarios/incrementarPuntos/findbyid/:usuario_id')
    .post(playalmiController.incrementarpuntuacionTotalUsuario)

/* RUTA "/USUARIOS/RESTARMONEDAS" (.POST): RESTAR MONEDAS A UN USUARIO */
router.route('/usuarios/restarMonedas/findbyid/:usuario_id')
    .post(playalmiController.restarMonedasUsuario);

/* RUTA "/USUARIOS/INCREMENTARPUNTOS" (.POST): INCREMENTAR PUNTOS A TODOS LOS USUARIOS */
router.route('/usuarios/incrementarPuntos/')
    .post(playalmiController.incrementarpuntuacionTotalGeneral)

/* RUTA "/USUARIOS/RESTARMONEDAS" (.POST): INSERTAR EL CONTENIDO UNA PARTIDA REALIZADA POR UN USUARIO */
router.route('/partidas/insertarPartida')
    .post(playalmiController.insertarPartida)

/* RUTA "/PARTIDAS/FINDBYID/" (.GET): OBTENER LAS ÚLTIMAS 5 PARTIDAS DE UN USUARIO */
router.route('/partidas/findbyid/:usuario_id')
    .get(playalmiController.mejoresPartidas);

/* RUTA "/PARTIDAS/" (.DELETE): INSERTAR/ELIMINAR PARTIDAS*/
router.route('/partidas/')
    .post(playalmiController.insertarPartida)
    .delete(playalmiController.eliminarPartidas)

/* RUTA "/USUARIOS/LOGIN/" (.GET): OBTENER LAS ÚLTIMAS 5 PARTIDAS DE UN USUARIO */
router.route('/usuarios/login')
    .post(playalmiController.login) 

/* EXPORTAR EL ENRUTADOR */
module.exports = router;