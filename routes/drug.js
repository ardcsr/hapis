var exports = module.exports = {};
var util = require('../util');

const drugModel = {
	
}


exports.routes = [
	{
		method: 'POST',
		path: '/api/drug/create',
		handler: function (request, reply) {
			var db = request.mongo.db;
			var payload = request.payload;
			console.log(payload);
			var validation = util.validate(drugModel, payload);

			if (validation.isValid) {
				if (typeof payload._id != 'undefined') delete payload._id;

				payload.lastupdate = new Date();

				db.collection('drugs').findOne({ _name: payload._name }, function (err, res) {
					if (err) {
						return reply({
							statusCode: 500,
							message: err.name,
							data: err.message
						});
					}

					if (res) {
						return reply({
							statusCode: 400,
							message: "Bad request",
							data: "This drug is already exist"
						});
					} else {
						//เพิ่มข้อมูลลง mongo
						db.collection('drugs').insertOne(payload, function (err, res) {
							if (err) {
								return reply({
									statusCode: 500,
									message: err.name,
									data: err.message
								});
							}
							return reply({
								statusCode: 200,
								message: "Create Successfully",
								data: res.ops[0]
							});
						});
					}
				});
			} else {
				return reply({
					statusCode: 400,
					message: "Bad request",
					data: "Missing required: " + validation.missing.concat()
				});
			}
		}
	},
	{
		method: 'POST',
		path: '/api/drug/update',
		handler: function (request, reply) {
			var db = request.mongo.db;
			var payload = request.payload;

			if (typeof payload._id != 'undefined') {
				var id = request.mongo.ObjectID(payload._id);
				delete payload._id;

				payload.lastupdate = new Date();

				db.collection('drugs').findOneAndUpdate({ _id: id }, { $set: payload }, { returnOriginal: false }, function (err, res) {
					if (err) {
						return reply({
							statusCode: 500,
							name: err.name,
							data: err.message
						});
					}
					if (res.value) {
						return reply({
							statusCode: 200,
							name: "Update successfully",
							data: res.value
						});
					} else {
						return reply({
							statusCode: 404,
							name: "Not found",
							data: "Document not found"
						});
					}
				});
			} else {
				return reply({
					statusCode: 400,
					message: "Bad request",
					data: "Missing required: _id"
				});
			}
		}
	},
	{
		method: 'GET',
		path: '/api/drug/list/{query?}',
		config: { auth: false },
		handler: function (request, reply) {
			var db = request.mongo.db;
			var q = request.params.query;
			var query = {
				_status: 1
			};
			if (q) {
				var conditionOR = [];
				conditionOR.push({
					"_name": { "$regex": q, "$options": "i" },
				});
				conditionOR.push({
					"_nameEN": { "$regex": q, "$options": "i" },
				});
				conditionOR.push({
					"_description": { "$regex": q, "$options": "i" },
				});
				query["$or"] = conditionOR;
			}
			db.collection('drugs').find(query, { _name: 1, _nameEN: 1, _description: 1, _type: 1, _stage: 1, lastupdate: 1, important: 1, star: 1 }).sort({ lastupdate: -1 }).toArray(function (err, res) {
				if (err) return reply({ statuscode: 500, message: err.name, data: err.message });

				return reply({
					statusCode: 200,
					message: "Successful",
					data: res
				})
			});
		}
	},
	{
		method: 'GET',
		path: '/api/drug/show/{id}',
		config: { auth: false },
		handler: function (request, reply) {
			var db = request.mongo.db;
			var id = request.params.id;

			db.collection('drugs').findOne({ _id: request.mongo.ObjectID(id) }, function (err, res) {
				if (err) return reply({ statuscode: 500, message: err.name, data: err.message });

				if (res) {
					return reply({
						statusCode: 200,
						message: "Successful",
						data: res
					})
				} else {
					return reply({
						statusCode: 404,
						message: "Document not found",
						data: null
					})
				}
			});
		}
	},
	{
		method: 'GET',
		path: '/list',
		handler(request, reply) {
			var db = request.mongo.db;
			var ObjectID = request.mongo.ObjectID;
			db.collection('drugs').find({}).toArray(function (err, res) {
				if (err) return reply({ statuscode: 500, message: err.name, data: err.message });

				return reply({
					statusCode: 200,
					message: "Successful",
					data: res
				})
			});

		}
	}
];