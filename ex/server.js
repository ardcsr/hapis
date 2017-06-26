'use strict';

// Import hapi module into the project
const Hapi = require('hapi');
const util = require('./util');

const routesDir = './routes';
const mongoose = require('mongoose');
const corsHeaders = require('hapi-cors-heade/druginfo'); // connect to mLab mongoDB

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ port: 8000 });

server.ext('onPreResponse', corsHeaders); // add corsHeader on pre-response



server.on('response', function (request) {
    console.log(util.timestamp() + ' - ' + request.info.remoteAddress + ' : ' + request.method.toUpperCase() + ' ' + request.url.path + ' [' + request.response.statusCode + ']');
});
server.register([ // add route to app.js
    require('./routes')
], (err) => {
    if (err) {
        throw err;
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
     console.log(util.items)
});