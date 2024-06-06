const express = require('express');
const router = express.Router();

const loginController = require('./src/Controllers/loginController');
const homeController = require('./src/Controllers/homeController');
const contatoController = require('./src/Controllers/contatoController');
const { loginRequired } = require('./src/middlewares/middlewares');

// ROTAS DA HOME
router.get('/', homeController.index);

// ROTAS DE LOGIN
router.get('/login/index', loginController.index);
router.post('/login/register', loginController.register);
router.post('/login/login', loginController.login);
router.get('/login/logout', loginController.logout);

//ROTAS DE CONTATO
router.get('/contato/index', loginRequired, contatoController.index);
router.post('/contato/register', loginRequired, contatoController.register);
router.get('/contato/index/:id', loginRequired, contatoController.editIndex);
router.post('/contato/edit/:id', loginRequired, contatoController.edit);
router.get('/contato/delete/:id', loginRequired, contatoController.delete);


module.exports = router;

