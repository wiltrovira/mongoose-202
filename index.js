var mongoose =  require("mongoose");
var personaSchema = require("./persona.server.model.js");
var fs = require ("fs");
var dataset = "./dataset.json";

//conecta la promesa
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));
mongoose.Promise = Promise;

//leer archivo de datos
var promiseLeerDataset = function(rutaArchivo){
	return new Promise (function(resolve, reject){
		fs.readFile(rutaArchivo, function(err, data) {
			if (err){
				reject(err);
			}else{
				console.log("Dataset en LeerDataset -->" + data);
				resolve (data);
			}
		});
	});
};

//leer archivo de datos
var promiseLeerImagen = function(data, rutaImagen){
	return new Promise (function(resolve, reject){
		fs.readFile(rutaImagen, function(err, imagen) {
			if (err){
				reject(err);
			}else{
				//console.log("imagen... -->" + imagen);
				resolve([data, imagen, "image/png"]);
			}
		});
	});
};


//------------------------------//
//Abrir la conexión - es una promesa
var promiseAbrirConexion = function(host, db, puerto, data, imagen, tipoMIME){
	return new Promise (function(resolve, reject){
		var conn = mongoose.createConnection(host, db, puerto, function(err){
			if (err){
				reject (err);
			}else {
				console.log("Conn en AbrirConexion --> " + conn.readyState);
				console.log("Data en AbrirConexion --> " + data);
				resolve ([conn, data, imagen, tipoMIME]);
			}
		});
	});
};

//------------------------------//
//Guardar los datos de la persona - es una promesa
var promiseGuardarPersona = function(conn, data, imagen, tipoMIME){
	return new Promise (function(resolve, reject){
		
		var Persona = conn.model("Persona", personaSchema, "personas");
		console.log("Data para guardar-->" + data);
		var dataJSON = JSON.parse(data);

		console.log("dataJSON a guardar -->");
		console.log(dataJSON);
		
		//Asigna los datos de la persona
		var persona = new Persona({
			primerNombre : dataJSON.primerNombre,
			segundoNombre : dataJSON.segundoNombre,
			primerApellido : dataJSON.primerApellido,
			segundoApellido : dataJSON.segundoApellido,
			estadoCivil : dataJSON.estadoCivil,
			generoSexo : dataJSON.generoSexo,
			idiomaPreferido : dataJSON.idiomaPreferido,
			fechaDeNacimiento : dataJSON.fechaDeNacimiento,
			permalink : dataJSON.permalink,
			correoElectronico : dataJSON.correoElectronico,
			avatarURI : dataJSON.avatarURI,
			avatar: { data: imagen, contentType: tipoMIME},
			passwordHash : dataJSON.passwordHash,
			passwordSalt : dataJSON.passwordSalt,
			timeStamp : dataJSON.timeStamp,
			fechaDeCreacion : dataJSON.fechaDeCreacion,
			fechaDeUltimaModificacion : dataJSON.fechaDeUltimaModificacion,
			prefijo : dataJSON.prefijo,
			sufijo : dataJSON.sufijo
		});
		
		persona.save(function(err){
			if (err){
				reject(err);
			}else{
				console.log("Persona guardada! --> " + persona);
				conn.close();
				resolve("Operación exitosa!");
			}
		});

	});
};

//Ejecuta las promesas
promiseLeerDataset(dataset)
	.then (function(data){
		console.log("Se leyó el archivo de datos --> " + data);
		var dataJSON = JSON.parse(data);
		var imagenURI = dataJSON.avatarURI;
		console.log("la imagen está en la ruta --> " + imagenURI);
		return promiseLeerImagen(data, imagenURI);
	}).spread (function(data, imagen, tipoMIME){
		return promiseAbrirConexion("localhost", "senquiu", 27017, data, imagen, tipoMIME);
	}).spread (function(conn, data, imagen, tipoMIME){
		console.log("promise 2 --> Estado de la conexión: " + conn.readyState);
		console.log("promise 2 --> Data --> : " + data);
		return promiseGuardarPersona(conn, data, imagen, tipoMIME);
	}).then (function(fromResolve){
		console.log(fromResolve);
	}).catch(function(err){
		console.error("Error! --> " + err);
	});

console.log("Esta es la última línea de código. ¿Cuándo debería ejecutarse? De manera asíncrona!");
