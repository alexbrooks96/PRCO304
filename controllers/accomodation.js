//var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();


var AccomodationModel = require('../models/accomodation');
var User = require('../models/user');



module.exports = function(app){
	router.get('/property', function(req, res){

		var query = Accomodation.find({});

		query.exec(function(err, property){
			if (err) {
				res.send(err);
			}
			res.json(property);
		});
	});
};

router.post('/addProperty', function(req, res){
	var newProperty = new Accomodation(req.body);
	newProperty.properties.addressL1 = req.body.addressL1;
	newProperty.properties.addressL2 = req.body.addressL2;
	newProperty.properties.city = req.body.city;
	newProperty.properties.county = req.body.county;
	newProperty.properties.postcode = req.body.postcode;
	newProperty.geometry.coordinates = [req.body.longitude, req.body.latitude];
	newProperty.save(function(err){
		if (err) {
			res.send(err);
		}			
		res.json(req.body);
	});


});

router.get('/addproperty', isLoggedIn, function(req, res){
	res.render('addproperty', {accomodation: req.accomodation, user: req.user});

});

router.get('/propertylist', isLoggedIn, function(req, res){
	AccomodationModel.find({}, function(err, data){
		res.render('propertylist', {accomodation: data, user: req.user});
		console.log(data);
	});
});

router.get('/viewproperty', isLoggedIn, function(req,res){

	var propID = req.body.propID;
	AccomodationModel.findOne({id: propID}, function(err, data){
	console.log(propID);
		res.render('viewproperty', {accomodation: data, user: req.user});
		});
	});


module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
};

