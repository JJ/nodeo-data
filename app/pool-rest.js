#!/usr/bin/env node

var fs= require('fs'),
rest= require('restler');

var app=express();

var port = process.argv[2] || 3000;

// console.log(conf);
var log = [];
var chromosomes = [];

log.push( conf );

// API Definitions
app.get('/best', function(req, res){
	    res.send({ chromosome : chromosomes[0] }
	    log.push( { get: process.hrtime()});
});

// API Definitions
app.put('/one/:chromosome', function(req, res){
    chromosomes.unshift( req.params.chromosome );
    log.push( { put: process.hrtime(),
		chromosome: chromosome } );
});

app.listen( port ) ;

