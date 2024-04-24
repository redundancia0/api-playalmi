const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

let apiRoutes = require("./api-routes")
let app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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













