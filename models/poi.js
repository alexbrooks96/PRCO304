var mongoose = require('mongoose');

var poiSchema = mongoose.Schema({


		type: {type: String, default: 'Feature'},
		properties: {

		poiTitle: {type: String, required: true},
		poiType:{type:String, required:true},
		poiAddressL1: {type: String, required: true},
		poiAddressL2: {type: String, required: false},
		poiCity: {type: String, required: true},
		poiCounty: {type: String, required: true},
		poiPostcode: {type: String, required: true},
		poiDescription: {type: String, required: true},

	},
		geometry: {
			type: {type: String, default:'Point'},
			coordinates: [Number],
		},
		//location: {type: [Number], required:true},//[Longitude, Latitude]

	});

	poiSchema.index({geometry: '2dsphere'});

	module.exports = mongoose.model('POI', poiSchema);