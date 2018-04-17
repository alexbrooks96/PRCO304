//required dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var mongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var favicon = require('serve-favicon');

var app = express();

//db connection
mongoose.connect('mongodb://localhost/StudentHousingApp');

var user = require('./controllers/user');
var accomodation = require('./controllers/accomodation');


require('./config/passport');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
	secret:'mysecretsessionkey',
	resave: true,
	saveUninitialized: true,
	store: new mongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());
app.use( express.static( "public" ) );
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(passport.initialize());
app.use(passport.session());

app.use(user);
app.use(accomodation);



app.listen(80, function(){
	console.log('listening on port 80');
});