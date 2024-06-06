require('dotenv').config();         //DOTENV SERVE PARA REMOVER AS SENHAS DESSE ARQUIVO

const express = require('express'); //INICIA EXPRESS
const app = express();              //EXECUTA EXPRESS
const mongoose = require('mongoose');               //BANCO DE DADOS
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Conectei à Base de Dados');
        app.emit('pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session');         //IDENTIFICA NAVEGADOR E SALVA COOKIES
const MongoStore = require('connect-mongo');        //SALVA SESSÕES NA BASE DE DADOS (POR PADRÃO SALVA EM MEMÓRIA)
const flash = require('connect-flash');             //FLASH MESSAGES (MENSAGENS AUTO DESTRUTIVAS SALVAS EM SESSÕES)
const routers = require('./routes');                //ROTAS DA APLICAÇÃO (CONTATO, HOME, ...)
const path = require('path');                       //TRABALHA COM NOMEAÇÃO DOS CAMINHOS
const helmet = require('helmet');                   //RECOMENDAÇÃO DO EXPRESS, DEIXA MAIS SEGURA A APLICAÇÃO
const csrf = require('csurf');                      //TOKENS PARA FORMULÁRIOS (EVITA POSTS DE SITES EXTERNOS)
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middlewares');      //MIDDLEWARES => FUNÇÕES EXECUTADAS NA ROTA (ANTES, NO MEIO OU DEPOIS DE RESPONDER O CLIENTE)

app.use(helmet());                                  //USA O HELMET
app.use(express.urlencoded({ extended: true}));     //POSTA FORMULÁRIOS PARA DENTRO DA APLICAÇÃO
app.use(express.json());                            //PARSE DE JSON PARA DENTRO DA APLICAÇÃO
app.use(express.static(path.resolve(__dirname, 'public')));     //ARQUIVOS ESTÁTICOS QUE DEVEM SER ACESSADOS DIRETAMENTE (BUNDLE, CSS, HTML, ...)

const sessionOptions = session({                                            //CONFIGURAÇÕES DAS SESSÕES
    secret: 'gato raul',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);    //EXECUTA AS OPÇÕES
app.use(flash());           //EXECUTA AS FLASH MESSAGES

app.set('views', path.resolve(__dirname, 'src', 'views'));      //ARQUIVOS RENDERIZADOS NA TELA (CAMINHO DELES)
app.set('view engine', 'ejs');                                  //ENGINE UTILIZADA PARA RENDERIZAR O HTML (.EJS NESSE CASO)

app.use(csrf());                 //EXECUTA O CSRF
app.use(middlewareGlobal);       //TODAS AS ROTAS E VERBOS EXECUTARÃO ESSE MIDDLEWARE
app.use(checkCsrfError);         //MIDDLEWARES
app.use(csrfMiddleware);         //MIDDLEWARES
app.use(routers);                //EXECUTANDO AS ROTAS

app.on('pronto', () => {                                //APLICAÇÃO EXECUTADA QUANDO MONGOOSE.CONNECT EMITIR O 'pronto'
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');       //APLICAÇÃO OUVINDO A PORTA
        console.log('Servidor executando na porta 3000');
    });
});

