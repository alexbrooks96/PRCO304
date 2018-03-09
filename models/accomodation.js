var mongoose = require('mongoose');


var accomodationSchema = mongoose.Schema({

	addressL1: {type: String, required: true},
	addressL2: {type: String, required: false},
	city: {type: String, required: true},
	county: {type: String, required: true},
	postcode: {type: String, required: true},
	location: {type: [Number], required:true},//[Longitude, Latitude]
	createdAt: {type: Date, default: Date.now}
});

accomodationSchema.index({location: '2dsphere'});

module.exports = mongoose.model('Accomodation', accomodationSchema);