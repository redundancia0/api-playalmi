const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session');
const cors = require('cors');

let apiRoutes = require("./api-routes")
let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
    secret: 'secreto-para-generar-la-sesion',
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

app.get('/', (req,res) => res.send('WS Playalmi'))

app.listen(port, function(){
    console.log("Cargado en el puerto: " + port)
})

app.use('/api', apiRoutes)












