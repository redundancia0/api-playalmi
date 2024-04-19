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

router.route('/usuarios/top')
    .get(playalmiController.topUsers)

router.route('/usuarios/incrementarPuntos/findbyid/:usuario_id')
    .post(playalmiController.incrementarPuntuacionUsuario)

router.route('/usuarios/incrementarPuntos/')
    .post(playalmiController.incrementarPuntuacionGeneral)

module.exports = router;