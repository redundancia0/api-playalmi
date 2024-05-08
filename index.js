const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session');
const rateLimit = require('express-rate-limit'); // Importar express-rate-limit
const cors = require('cors');

let apiRoutes = require("./api-routes")
let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
    secret: 'PlayAlmi1234!?!?!?!?!?',
    resave: false,
    saveUninitialized: true
}));

mongoose.connect('mongodb://localhost/playalmi', {useNewUrlParser: true, useUnifiedTopology:true})
var db = mongoose.connection;

if(!db){
    console.log("ERROR conectándose a la DB")
} else {
    console.log("DB conectada exitosamente")
}

var port = process.env.port || 8080


/******************************************************************/
/* ELEMENTO INNOVADOR -> PROTECCIÓN MEDIANTE EL USO DE RATE LIMIT */
/******************************************************************/
const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 300,
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta nuevamente más tarde.',
    keyGenerator: function (req /*, res*/) {
        return req.ip;
    },
    skip: function (req, res) {
        return req.ip === '127.0.0.1';
    }
});

app.use(limiter);


app.get('/', (req,res) => res.send('WS Playalmi'))

app.listen(port, function(){
    console.log("Cargado en el puerto: " + port)
})

app.use('/api', apiRoutes)












