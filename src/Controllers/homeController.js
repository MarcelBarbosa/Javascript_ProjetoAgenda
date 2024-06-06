const Contato = require('../Models/contatoModel');

exports.index = async function(req, res) { 
    const contatos = await Contato.buscaContatos();
    res.render('index', { contatos });
};
