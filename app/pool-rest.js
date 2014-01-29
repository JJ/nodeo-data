#!/usr/bin/env node

var fs= require('fs'),
express= require('express');

var app=express();

var port = process.argv[2] || 5000;

// console.log(conf);
var log = [];
var chromosomes = {};

// API Definitions
app.get('/random', function(req, res){
	    if (Object.keys(chromosomes ).length > 0) {
		var keys = Object.keys(chromosomes );
		var one = keys[ Math.floor(keys.length*Math.random())];
		res.send({ chromosome : one });
		log.push( { get: process.hrtime()});
	    } else {
		res.status(404).send('No chromosomes yet');
	    }
	   
});

app.get('/log', function(req, res){
	    res.send( log );
});

// API Definitions
app.put('/one/:chromosome', function(req, res){
	    if ( req.params.chromosome ) {
		chromosomes[ req.params.chromosome ] = 1; // to avoid repeated chromosomes
		log.push( { put: process.hrtime(),
			chromosome: req.params.chromosome } );
		res.send( { length : Object.keys(chromosomes).length });
	    } else {
		res.send( { length : 0 });
	    }
	    
});

app.use(function(err, req, res, next){
	      //check error information and respond accordingly
	      console.error( "Exception in server ", err.stack);
});

app.listen( port ) ;
process.on('uncaughtException',function( err) {
	       console.log( "Exception in server ", err);
	   });

app.configure(function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


