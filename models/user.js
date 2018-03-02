var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//User schema
var userSchema = mongoose.Schema({
	title: { type: String, enum: ['Mr', 'Master', 'Miss', 'Mrs', 'Ms'] },
	firstName: {type: String},
	secondName: {type: String},
	email: {type:String},
	password: {type:String},
	studentNumber: {type:String},


});


//uses passport to hash password for security. 
userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//Checks for valid password, against what is stored for the user in the db
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

//exports the user schema
module.exports = mongoose.model('User', userSchema);