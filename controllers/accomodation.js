//var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();

var Accomodation = require('../models/accomodation');
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
		newProperty.addressL1 = req.body.addressL1;
		newProperty.addressL2 = req.body.addressL2;
		newProperty.city = req.body.city;
		newProperty.county = req.body.county;
		newProperty.postcode = req.body.postcode;
		newProperty.location = [req.body.longitude, req.body.latitude];

		newProperty.save(function(err){
			if (err) {
				res.send(err);

			}

			res.json(req.body);
			successRedirect: '/profile';
		});


	});

router.get('/addproperty', isLoggedIn, function(req, res){
	res.render('addproperty', {accomodation: req.accomodation, user: req.user});

});

module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
};
