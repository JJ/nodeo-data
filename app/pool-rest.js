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
	    var keys = Object.keys(chromosomes );
	    var one = keys[ Math.floor(keys.length*Math.random())];
	    res.send({ chromosome : one });
	    log.push( { get: process.hrtime()});
});

app.get('/log', function(req, res){
	    res.send( log );
});

// API Definitions
app.put('/one/:chromosome', function(req, res){
	    chromosomes[ req.params.chromosome ] = 1; // to avoid repeated chromosomes
	    log.push( { put: process.hrtime(),
			chromosome: req.params.chromosome } );
	    res.send( { length : Object.keys(chromosomes).length });
});

app.listen( port ) ;

