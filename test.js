const axios = require('axios');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const numberOfRequests = 1000000;
const apiUrl = 'http://localhost:8080/api/usuarios';

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    console.log(`Worker ${process.pid} started`);
    makeRequests();
}

async function makeRequests() {
    try {
        for (let i = 0; i < numberOfRequests; i++) {
            const res = await axios.get(apiUrl);
            console.log(`Solicitud ${i + 1} realizada por Worker ${process.pid}`);
        }
        console.log(`Todas las solicitudes completadas por Worker ${process.pid}`);
    } catch (error) {
        console.error(`Error al realizar las solicitudes por Worker ${process.pid}:`, error.message);
    }
}
