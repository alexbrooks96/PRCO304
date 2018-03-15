var mongoose = require('mongoose');


var accomodationSchema = mongoose.Schema({


	type: {type: String, default: 'Feature'},
	properties: {
	addressL1: {type: String, required: true},
	addressL2: {type: String, required: false},
	city: {type: String, required: true},
	county: {type: String, required: true},
	postcode: {type: String, required: true},
	createdAt: {type: Date, default: Date.now},
},
	geometry: {
		type: {type: String, default:'Point'},
		coordinates: [Number],
	},
	//location: {type: [Number], required:true},//[Longitude, Latitude]

});

accomodationSchema.index({geometry: '2dsphere'});

module.exports = mongoose.model('Accomodation', accomodationSchema);