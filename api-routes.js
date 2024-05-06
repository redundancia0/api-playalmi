let router = require('express').Router();

router.get('/', function(req, res)
{
    res.json({
        status: 'Api trabajando',
        message: '---> FUNCIONANDO <----'
    });
});

var playalmiController = require('./playalmiController')
router.route('/usuarios')
    .get(playalmiController.obtenerUsuarios)
    .delete(playalmiController.eliminarUsuarios)
    .post(playalmiController.crearUsuario)

router.route('/usuarios/findbyid/:usuario_id')
    .get(playalmiController.verUsuario)
    .delete(playalmiController.eliminarUsuario)
    .put(playalmiController.actualizarUsuario)

router.route('/partidas/top') 
    .get(playalmiController.topUsuarios) // CAMBIAR LA FUNCIÓN PARA QUE EN VEZ DE VER EL TOP MEJORES USUARIOS, LO MIRE DESDE EL DOCUMENTO PARTIDAS, EN VEZ DE DESDE EL DOCUMENTO USUARIOS

router.route('/usuarios/incrementarPuntos/findbyid/:usuario_id')
    .post(playalmiController.incrementarpuntuacionTotalUsuario)

router.route('/usuarios/restarMonedas/findbyid/:usuario_id')
    .post(playalmiController.restarMonedasUsuario);

router.route('/backup/receive')
    .post(playalmiController.backupReceiver)

router.route('/usuarios/incrementarPuntos/')
    .post(playalmiController.incrementarpuntuacionTotalGeneral)

router.route('/partidas/insertarPartida')
    .post(playalmiController.insertarPartida)

router.route('/partidas/findbyid/:usuario_id')
    .get(playalmiController.ultimasPartidas);

router.route('/partidas/')
    .post(playalmiController.insertarPartida)
    .delete(playalmiController.eliminarPartidas)

router.route('/usuarios/login')
    .post(playalmiController.login) 

module.exports = router;