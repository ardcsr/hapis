'use strict';

// Import hapi module into the project
const Hapi = require('hapi');
const util = require('./util');

const routesDir = './routes';
const config = require('./config.json');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ port: 38302 });


server.on('response', function (request) {
	if (request.url.path.indexOf('/app') == -1) {
		console.log(util.timestamp() + ' - ' + request.info.remoteAddress + ' : ' + request.method.toUpperCase() + ' ' + request.url.path + ' [' + request.response.statusCode + ']');
	}
});
// server.route({
// 	method: 'GET',
// 	path: '/list',
// 	handler(request, reply) {
// 		var db = request.mongo.db;
// 		var ObjectID = request.mongo.ObjectID;
// 		db.collection('info').find({}).toArray(function (err, res) {
// 			if (err) return reply({ statuscode: 500, message: err.name, data: err.message });

// 			return reply({
// 				statusCode: 200,
// 				message: "Successful",
// 				data: res
// 			})
// 		});

// 			}
// })


server.register([
	{
		register: require('inert')
	},
	{
		register: require('hapi-cors')
	},
	{
		register: require('hapi-auth-jwt2')
	},
	{
		register: require('hapi-mongodb'),
		options: config.dbOpts
	}
], function (err) {
	if (err) throw err

	
	util.registerRoutes(server, routesDir);

	server.route([
		{
			method: 'GET',
			path: '/app/{param*}',
			config: { auth: false },
			handler: {
				directory: {
					path: 'app',
					listing: true
				}
			}
		},
		{
			method: 'GET',
			path: '/',
			config: { auth: false },
			handler: function (request, reply) {
				return reply().redirect('/app')
			}
		}
	])


	// Start the server
	server.start((err) => {

		if (err) {
			throw err;
		}
		console.log('Server running at:', server.info.uri);
	});
})


// function validate(decoded, request, callback) {
	// return callback(null, true);
	// if (decoded.name === 'Chai Phonbopit') {
	//     return callback(null, true);
	// } else {
	//     return callback(null, false);
	// }
// }
