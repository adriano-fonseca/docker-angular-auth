'use strict';

// Constants
const express = require('express');
const app = express();
const bodyParser= require('body-parser')

const PORT = 8081;
var http = require("http");
var request = require('request');

var jwt = require('express-jwt');
var cors = require('cors');

var url = require('url');
var path = require('path');
var server = require('http').Server(app);


/*CORS*/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, '../')));


app.listen(PORT);
console.log('Running on http://middleware:' + PORT);

app.options('*', cors()); 
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
    next();
});

/*END: CORS*/


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * Middleware
*/
var authCheck = jwt({
	secret : new Buffer('s1HVO6tlIgDUXjYfavm3d6SsJkqVGnVJSLA6dCuVRdKPk_y7yxAk8dCG5T0UPcVe'),
	audience : 'dfBT1qpRBvlmDDInHttYBsotMY8AteDT'
});



app.get('/api/public', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var users = [
		{
			"name" : "Adriano",
			"type" : "public",
			"age" : 30
		},

		{
			"name" : "Cassio",
			"type" : "public",
			"age" : 25
		}
	]

	res.status(200).send(users);
	console.log("(Midleware) Public Endpoind");
	//res.send(users, 200);
});


app.get('/api/private', authCheck, function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var users = [
		{
			"name" : "Adriano",
			"type" : "private",
			"age" : 30
		},

		{
			"name" : "Cassio",
			"type" : "private",
			"age" : 25
		}
	]
	console.log("(Midleware) Private Endpoint");
	res.status(200).send(users);
	//res.send(users, 200);
})


app.get('/api/students', authCheck, function(req, response) {
	var req = http.get('http://java-api:8080/PlayJavaEE/rest/students', function(res) {
		res.on('data', function(data) {
			if(data !== null && typeof data !== undefined){
				console.log('(Midleware) Private Endpoint -> External API');
				response.status(200).send(data);
			} else {
				response.status(501).send("Internal Error");
				}
			}
			///response.send(data, 200)
		);
	}).on('error', function(e) {
		console.log("Got an error: ", e);
	});
})



app.delete('/api/students/:idStudent', authCheck, function(req, res) {
	
	var idStudent = req.params.idStudent;
	
	var req = {
	    host: 'java-api',
	    port: 8080,
	    path: '/PlayJavaEE/rest/students/'+idStudent,
	    method: 'DELETE',
	    headers: {}
	} 
	
	var request = http.request(req);
	
	request.on('response', function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function(response) {
	        if(response.indexOf('"failed":0') === -1) {
	            console.log('Response: ', response);
	            return response;
	        }
	    }, function(error){
	    	console.log(error)
	    });
	    
	});
	request.on('error', function(err) { cb(err); });
	request.end();
	res.status(200).send('Record Deleted');
});


app.post('/api/students', (req,res) => {
	console.log(req.body);

	const request = require('request-promise');
	const options = {
	    method: 'POST',
	    uri: 'http://java-api:8080/PlayJavaEE/rest/students/',
	    body: req.body,
	    json: true,
	    headers: {
	        'Content-Type': 'application/json'
	    }
	}

	request(options).then(function (response){
	    res.status(200).json(response);
	})
	.catch(function (err) {
	    console.log(err);
	})
});



