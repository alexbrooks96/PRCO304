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
	var newProperty = new AccomodationModel(req.body);
	newProperty.properties.addressL1 = req.body.addressL1;
	newProperty.properties.addressL2 = req.body.addressL2;
	newProperty.properties.city = req.body.city;
	newProperty.properties.county = req.body.county;
	newProperty.properties.postcode = req.body.postcode;
	newProperty.properties.description = req.body.description;
	newProperty.properties.numRooms = req.body.numRooms;
	newProperty.properties.internetIncluded = req.body.internetIncluded;
	newProperty.properties.tvLicenseIncluded = req.body.tvLicenseIncluded;
	newProperty.properties.cleanerIncluded = req.body.cleanerIncluded;
	newProperty.properties.loungeIncluded = req.body.loungeIncluded;
	newProperty.properties.parkingIncluded = req.body.parkingIncluded;
	newProperty.properties.bathIncluded = req.body.bathIncluded;
	newProperty.properties.secureLocksIncluded = req.body.secureLocksIncluded;

	newProperty.geometry.coordinates = [req.body.longitude, req.body.latitude];
	newProperty.save(function(err){
		if (err) {
			res.send(err);
		}			
		res.json(req.body);



	});
	// res.redirect('/profile');
});



router.get('/addproperty', isLoggedIn, isUserAuthorised, function(req, res){
	// res.render('addproperty', {accomodation: req.accomodation, user: req.user});

	AccomodationModel.find({}, function(err, data){
		res.render('addProperty', {accomodation: data, user: req.user});
		//console.log(data);
	});

});

router.get('/propertylist', isLoggedIn, function(req, res){
	AccomodationModel.find({}, function(err, data){
		res.render('propertylist', {accomodation: data, user: req.user});
		console.log(data);
	});
});

// router.get('/viewproperty', isLoggedIn, function(req,res){

// 	var propID = req.body.propID;
// 	AccomodationModel.findOne({id: propID}, function(err, data){
// 	console.log(propID);
// 		res.render('viewproperty', {accomodation: data, user: req.user});
// 		});
// });

router.get('/viewproperty', isLoggedIn, function(req,res){

	var propID = req.query.propID;
	var addressL1 = req.query.addressL1;

	console.log(propID);
		AccomodationModel.findOne({_id: propID, addressL1: addressL1}, function(err, data){
		res.render('viewproperty', {accomodation: data, user: req.user});
		});
});

router.get('/editproperty', isLoggedIn, isUserAuthorised, function(req,res){

	var propID = req.query.propID;
	var addressL1 = req.query.addressL1;

	console.log(propID);
		AccomodationModel.findOne({_id: propID, addressL1: addressL1}, function(err, data){
		res.render('editproperty', {accomodation: data, user: req.user});
		});
});

router.post('/addToFavourites', function (req, res){
	var propertyIDEntry = String(req.body.propertyID);
	var propertyAddrL1Entry = String(req.body.propertyAddrL1);
	var userID = req.user._id;

	console.log(req);

	var favouritesEntry = {
		propertyID : propertyIDEntry,
		propertyAddrL1 : propertyAddrL1Entry,
	}

	User.updateOne(
		{
			"_id": userID
		}, 
		{

			$push: {'favourites': favouritesEntry},

		},
		function(err, result){
		console.log('Added to favourites');
		console.log(favouritesEntry);

		res.redirect('/profile');

		if(err) {
			console.error(err);
		}
	});
});

router.post('/editproperty', function (req, res, next){
	var propID = req.body.propID;

	var newAddressL1 = String(req.body.addressL1);
	var newAddressL2= String(req.body.addressL2);
	var newCity = String(req.body.city);
	var newCounty = String(req.body.county);
	var newPostcode = String(req.body.postcode);
	var newDescription = String(req.body.description);
	var newNumRooms = Number(req.body.numRooms);
	var newInternetIncluded = Boolean(req.body.internetIncluded);
	var newTvLicenseIncluded = Boolean(req.body.tvLicenseIncluded);
	var newCleanerIncluded = Boolean(req.body.cleanerIncluded);
	var newLoungeIncluded = Boolean(req.body.loungeIncluded);
	var newParkingIncluded = Boolean(req.body.parkingIncluded);
	var newSecureLocksIncluded = Boolean(req.body.secureLocksIncluded);
	var newBathIncluded = Boolean(req.body.bathIncluded);


	//Changes the values for each of the below to what is in the edit input boxes. Updates and saves user details.
	AccomodationModel.updateOne(
		{
			"_id": propID 
		}, 
		{
			$set: {'properties.addressL1': newAddressL1, 'properties.addressL2': newAddressL2, 'properties.city': newCity, 'properties.county': newCity, 'properties.postcode': newPostcode,
			'properties.description': newDescription, 'properties.numRooms': newNumRooms, 'properties.internetIncluded': newInternetIncluded, 'properties.tvLicenseIncluded': newTvLicenseIncluded,
			'properties.cleanerIncluded': newCleanerIncluded, 'properties.loungeIncluded': newLoungeIncluded, 'properties.parkingIncluded': newLoungeIncluded, 'properties.secureLocksIncluded': newSecureLocksIncluded,
			'properties.bathIncluded': newBathIncluded
		}
			//'properties.numRooms': newNumRooms, 'properties.internetIncluded': newInternetIncluded
		},

		function(err, result){
		console.log('property updated');
		res.redirect('/propertylist');

		if(err) {
			console.error(err);
		}
	});
});

router.get('/profiletest', isLoggedIn, isUserAuthorised, function(req, res){
	AccomodationModel.find({}, function(err, data){
		res.render('profiletest', {accomodation: data, user: req.user});
		//console.log(data);
	});
});

router.get('/favourites', isLoggedIn, function(req, res){
	var userID = req.user.id;

	User.findOne({_id: userID}, function(err, data){
		res.render('favourites', {users: data, user: req.user});
	});
});

router.get('/deleteproperty', isLoggedIn, isUserAuthorised, function(req,res){

	var propID = req.query.propID;
	var addressL1 = req.query.addressL1;

	console.log(propID);
		AccomodationModel.findOne({_id: propID, addressL1: addressL1}, function(err, data){
		res.render('deleteproperty', {accomodation: data, user: req.user});
		});
});

router.post('/deleteproperty', function (req, res, next){
	var propID = req.body.propID;
	AccomodationModel.deleteOne(
		{
			"_id": propID 
		}, 
			function(err, result){
			console.log('property deleted');
			res.redirect('/propertylist');

			if(err) {
				console.error(err);
			}
		});

	});




module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
};

function isUserAuthorised(req, res, next){
	if (req.user.role == "admin") {
		return next();
	}
	res.redirect('/profile');
};

