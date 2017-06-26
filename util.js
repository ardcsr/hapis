var exports = module.exports = {};
const Fs = require('fs');
const Async = require('async');
const Path = require('path');

exports.SECRET_KEY = "9FDA1EF42CCEF9A277EF5B897C814";

exports.uuId = require('uuid/v1');

exports.registerRoutes = function(server, routesDir){
    Fs.readdir(routesDir, function (err, list) {
    if (err) {
        console.log(err);
    }
    Async.each(list, function (file, callback) {

        // Skip files with unknown filename extension
        if (!file.match(/\.(js)$/)) {
            return callback();
        }
        // Change routes path to './'
        var tmpdir = routesDir.split('/');
        tmpdir[0] = '.';
        var routesdir = tmpdir.join('/');

        const modulePath = routesdir+ "/" +file;
        const routeFile = require(modulePath);

        // Register routes from path './routes'
        if(typeof routeFile.routes != 'undefined') {
            server.route(routeFile.routes);
        }
    });
});
};

exports.timestamp = function() {
	var time = new Date();
	return time.getFullYear() + '-' + (+time.getMonth() < 9? '0'+(+time.getMonth()+1): (+time.getMonth()+1)) +
		'-' + (+time.getDate() < 10? '0'+(time.getDate()): time.getDate()) +
		' ' + (+time.getHours() < 10? '0'+(time.getHours()): time.getHours()) +
		':' + (+time.getMinutes() < 10? '0'+(time.getMinutes()): time.getMinutes()) +
		':' + (+time.getSeconds() < 10? '0'+(time.getSeconds()): time.getSeconds());
}


exports.validate = function (model,obj) {
	var validation= {
		isValid: false,
		missing: []
	};
	for(var k in model){
		if(k.charAt(0) == "_") {
			if(typeof obj[k] == "undefined" || !obj[k]){
				if(obj[k] != 0) {
					validation.missing.push(k);
				}
			}
		}
	}
	if(validation.missing.length == 0) {
		validation.isValid = true;
	}
	return validation;
}

exports.formatBytes = function (bytes,decimals) {
	if(bytes == 0) return '0 Bytes';
	var k = 1000,
		dm = decimals || 2,
		sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
