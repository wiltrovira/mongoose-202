var mongoose =  require("mongoose");

var personaSchema = new mongoose.Schema;
personaSchema.add({
	primerNombre : String,
	segundoNombre : String,
	primerApellido : String,
	segundoApellido : String,
	estadoCivil : String,
	generoSexo : String,
	idiomaPreferido : {type: String, default: "Español"},
	fechaDeNacimiento : Date,
	permalink : {type: String, default: this.primerNombre+this.primerApellido},
	correoElectronico : String,
	avatarURI: String,
	avatar : { data: Buffer, contentType: String},
	passwordHash : String,
	passwordSalt : String,
	timeStamp : String,
	fechaDeCreacion : {type: Date, default: Date.now},
	fechaDeUltimaModificacion : {type: Date, default: Date.now},
	prefijo : String,
	sufijo : String,
});

module.exports = personaSchema;
