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
    .get(playalmiController.index)
    .post(playalmiController.new)

router.route('/usuarios/findbyid/:usuario_id')
    .get(playalmiController.view)
    .delete(playalmiController.delete)
    .put(playalmiController.update)

router.route('/partidas/top') 
    .get(playalmiController.topUsers) // CAMBIAR LA FUNCIÓN PARA QUE EN VEZ DE VER EL TOP MEJORES USUARIOS, LO MIRE DESDE EL DOCUMENTO PARTIDAS, EN VEZ DE DESDE EL DOCUMENTO USUARIOS

router.route('/usuarios/incrementarPuntos/findbyid/:usuario_id')
    .post(playalmiController.incrementarpuntuacionTotalUsuario)

router.route('/usuarios/incrementarPuntos/')
    .post(playalmiController.incrementarpuntuacionTotalGeneral)

router.route('/partidas/insertarPartida')
    .post(playalmiController.insertarPartida)

router.route('/usuarios/login')
    .post(playalmiController.login) 

module.exports = router;