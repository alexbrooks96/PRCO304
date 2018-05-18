//var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();

//Loading through the schemas
var AccomodationModel = require('../models/accomodation');
var User = require('../models/user');
var Ticket = require('../models/ticket');
var POI = require('../models/poi');




//gets all properties ready for use on map
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

//post method to add new property to the system
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
	newProperty.save(function(err, result){
		console.log('property added');
		res.redirect('/profile');

		if (err) {
			res.send(err);
		}			
		//res.json(req.body);
	});

	// res.redirect('/profile');
});


//renders add property page - passes through accommodation model
router.get('/addproperty', isLoggedIn, isUserAuthorised, function(req, res){
	// res.render('addproperty', {accomodation: req.accomodation, user: req.user});

	AccomodationModel.find({}, function(err, data){
		res.render('addProperty', {accomodation: data, user: req.user});
		//console.log(data);
	});

});

//Renders property list with a list of all properties in collection
router.get('/propertylist', isLoggedIn, function(req, res){
	AccomodationModel.find({}, function(err, data){
		res.render('propertylist', {accomodation: data, user: req.user});
		console.log(data);
	});
});


//Renders view individual property. Uses the _id of the property to query db. POI data passed through.
router.get('/viewproperty', isLoggedIn, function(req,res){

	var propID = req.query.propID;
	var addressL1 = req.query.addressL1;

	console.log(propID);
		
		AccomodationModel.findOne({_id: propID, addressL1: addressL1}, function(err, data){
			POI.find({}, function(err, poiData){
				if (data && poiData) {
		res.render('viewproperty', {accomodation: data, poi: poiData, user: req.user});
	} else {
		res.render('404error', {user: req.user});
	}
	});
	});
});

//Renders edit property page - Uses _id of property to populate form from db query
router.get('/editproperty', isLoggedIn, isUserAuthorised, function(req,res){

	var propID = req.query.propID;
	var addressL1 = req.query.addressL1;

	console.log(propID);
		AccomodationModel.findOne({_id: propID, addressL1: addressL1}, function(err, data){
			if (data) {
		res.render('editproperty', {accomodation: data, user: req.user});
	} else {
		res.render('404error', {user: req.user});
	}
		});
	});

//Adds a property to users favourite, stored as an array in user collection
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


//Post for edit property, overwrites any changes made.
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
	var newIsVisible = Boolean(req.body.isVisible);


	//Changes the values for each of the below to what is in the edit input boxes. Updates and saves user details.
	AccomodationModel.updateOne(
		{
			"_id": propID 
		}, 
		{
			$set: {'properties.addressL1': newAddressL1, 'properties.addressL2': newAddressL2, 'properties.city': newCity, 'properties.county': newCity, 'properties.postcode': newPostcode,
			'properties.description': newDescription, 'properties.numRooms': newNumRooms, 'properties.internetIncluded': newInternetIncluded, 'properties.tvLicenseIncluded': newTvLicenseIncluded,
			'properties.cleanerIncluded': newCleanerIncluded, 'properties.loungeIncluded': newLoungeIncluded, 'properties.parkingIncluded': newLoungeIncluded, 'properties.secureLocksIncluded': newSecureLocksIncluded,
			'properties.bathIncluded': newBathIncluded, 'properties.isVisible': newIsVisible
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

//test profile page render
router.get('/profiletest', isLoggedIn, isUserAuthorised, function(req, res){
	AccomodationModel.find({}, function(err, data){
		res.render('profiletest', {accomodation: data, user: req.user});
		//console.log(data);
	});
});

//renders favourite page
router.get('/favourites', isLoggedIn, function(req, res){
	var userID = req.user.id;

	User.findOne({_id: userID}, function(err, data){
		res.render('favourites', { user: req.user});
	});
});

//renders delete property confirmation page, selected property carried through
router.get('/deleteproperty', isLoggedIn, isUserAuthorised, function(req,res){

	var propID = req.query.propID;
	var addressL1 = req.query.addressL1;

	console.log(propID);
		AccomodationModel.findOne({_id: propID, addressL1: addressL1}, function(err, data){
		res.render('deleteproperty', {accomodation: data, user: req.user});
		});
});

//Removes selected property from favourite list
router.get('/removefavourite', isLoggedIn, function(req,res){

	var propID = req.query.propID;
	var addressL1 = req.query.addressL1;

	console.log(propID);
		AccomodationModel.findOne({_id: propID, addressL1: addressL1}, function(err, data){
		res.render('removefavourite', {accomodation: data, user: req.user});
		});
});

//post to remove favourite from array
router.post('/removefavourite', function (req, res){
	var favouriteID = String(req.body.favouriteID);

	var userID = String(req.body.userID);

	console.log(req);

	// var favouritesEntry = {
	// 	propertyID : propertyIDEntry,
	// 	propertyAddrL1 : propertyAddrL1Entry,
	// }

	User.update(
		{
			"_id": userID
		},

		{
			$pull: {favourites: {"_id": favouriteID}}
		},
	
		function(err, result){
		console.log('removed from favourites');
		//console.log(favouritesEntry);

		res.redirect('/favourites');

		if(err) {
			console.error(err);
		}
	});
});

//Post method to delete property from the accomodation collection
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

//render users support ticket based on ID, brings through support tickets for that user _id
router.get('/mysupporttickets', isLoggedIn, function(req, res){
	var userID = req.user.id;

	//Ticket.findOne({studentID: userID},

	Ticket.find({studentID: userID}, function(err, data){
		res.render('mysupporttickets', { ticket:data, user: req.user});
	});
});

//renders new ticket form/page
router.get('/newticket', isLoggedIn, function(req, res){

	// Ticket.find({}, function(err, data){

	// 	var ticketdata = data;
	// }

	AccomodationModel.find({}, function(err,data){
		res.render('newticket', {accomodation: data, user: req.user});
		})
	});

//adds new ticket to collection
router.post('/newticket', function(req, res){
	var newTicket = new Ticket(req.body);
	newTicket.title = req.body.title;
	newTicket.propertyAddrL1 = req.body.listADDR1;
	newTicket.category = req.body.category;
	newTicket.description = req.body.description;
	newTicket.studentID = req.body.studentID;
	
	newTicket.save(function(err, result){
		console.log('new ticket created');
		res.redirect('/profile');

		if (err) {
			res.send(err);
		}			
		//res.json(req.body);
	});

	// res.redirect('/profile');
});

//gets all support tickets 
router.get('/allsupporttickets', isLoggedIn, isUserAuthorised, function(req, res){
	var userID = req.user.id;

	//Ticket.findOne({studentID: userID},

	Ticket.find({}, function(err, data){
		res.render('allsupporttickets', { ticket:data, user: req.user});
	});
});

//views an individual support ticket, admin level
router.get('/viewsupportticket', isLoggedIn, isUserAuthorised, function(req,res){

	var ticketID = req.query.ticketID;
	console.log(ticketID);
		Ticket.findOne({_id: ticketID}, function(err, data){
			if (data) {
		res.render('viewsupportticket', {supportticket: data, user: req.user});
	} else {
		res.render('404error', {user:req.user});
		};
	})
});

//views a users personal ticket
router.get('/viewmysupportticket', isLoggedIn, function(req,res){

	var ticketID = req.query.ticketID;
	console.log(ticketID);
		Ticket.findOne({_id: ticketID}, function(err, data){
			if (data) {
		res.render('viewmysupportticket', {supportticket: data, user: req.user});
	} else {
		res.render('404error', {user: req.user});
		};
	})
});

//admin post method to delete a ticket
router.post('/deleteticket', function (req, res, next){
	var ticketID = req.body.ticketID;
	Ticket.deleteOne(
		{
			"_id": ticketID 
		}, 
			function(err, result){
			console.log('ticket deleted');
			res.redirect('/allsupporttickets');

			if(err) {
				console.error(err);
			}
		});

	});

//admin post for an update ticket, resolves ticket boolean
router.post('/updateticket', function (req, res, next){
	var ticketID = req.body.ticketID;

	var newAdminResponse = String(req.body.adminresponse);
	var newSolution= String(req.body.solution);
	var newIsResolved = Boolean(req.body.isResolved);



	//Changes the values for each of the below to what is in the edit input boxes. Updates and saves user details.
	Ticket.updateOne(
		{
			"_id": ticketID 
		}, 
		{
			$set: {'adminResponse': newAdminResponse, 'solution': newSolution, 'isResolved': newIsResolved
		}
			//'properties.numRooms': newNumRooms, 'properties.internetIncluded': newInternetIncluded
		},

		function(err, result){
		console.log('ticket updated');
		res.redirect('/allsupporttickets');

		if(err) {
			console.error(err);
		}
	});
});

//render view for new POI
router.get('/newpoi', isLoggedIn, isUserAuthorised, function(req, res){

	// Ticket.find({}, function(err, data){

	// 	var ticketdata = data;
	// }

	POI.find({}, function(err,data){
		res.render('newpoi', {poi: data, user: req.user});
		})
	});

//Post method for adding a new POI
router.post('/newpoi', function(req, res){
	var newPOI = new POI(req.body);
	newPOI.properties.poiTitle = req.body.poiTitle;
	newPOI.properties.poiType = req.body.poiType;
	newPOI.properties.poiAddressL1 = req.body.poiAddressL1;
	newPOI.properties.poiAddressL2 = req.body.poiAddressL2;
	newPOI.properties.poiCity = req.body.poiCity;
	newPOI.properties.poiCounty = req.body.poiCounty;
	newPOI.properties.poiPostcode = req.body.poiPostcode;
	newPOI.properties.poiDescription = req.body.poiDescription;

	newPOI.geometry.coordinates = [req.body.longitude, req.body.latitude];



	
	newPOI.save(function(err, result){
		console.log('new POI created');
		res.redirect('/viewallpoi');

		if (err) {
			res.send(err);
		}			
		//res.json(req.body);
	});

	// res.redirect('/profile');
});

//admin control to view all POIs
router.get('/viewallpoi', isLoggedIn, isUserAuthorised, function(req, res){
	var userID = req.user.id;

	//Ticket.findOne({studentID: userID},

	POI.find({}, function(err, data){
		res.render('viewallpoi', { pois:data, user: req.user});
	});
});


//renders view for delete a POI from the system
router.get('/deletepoi', isLoggedIn, isUserAuthorised, function(req,res){

	var poiID = req.query.poiID;


	console.log(poiID);
		POI.findOne({_id: poiID}, function(err, data){
		res.render('deletepoi', {pois: data, user: req.user});
		});
});

//delete a POI from the system
router.post('/deletepoi', function (req, res, next){
	var poiID = req.body.poiID;
	POI.deleteOne(
		{
			"_id": poiID 
		}, 
			function(err, result){
			console.log('POI deleted');
			res.redirect('/viewallpoi');

			if(err) {
				console.error(err);
			}
		});

	});


module.exports = router;

//Authentication tests
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

