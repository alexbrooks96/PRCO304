var mongoose = require('mongoose');

var ticketSchema = mongoose.Schema({

	title:{type:String},
	propertyAddrL1:{type:String},
	category:{type:String},
	description:{type:String},
	createdAt: {type: Date, default: Date.now},
	adminResponse:{type:String},
	solution:{type:String},
	isResolved:{type:Boolean, default:false},
	resolvedDate:{type:Date},
	studentID:{type:String},

});

//exports the user schema
module.exports = mongoose.model('Ticket', ticketSchema);