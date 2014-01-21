#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
trap = require('../lib/trap.js'),
express = require('express'),
fs= require('fs');

var app=express();

var conf_file = process.argv[2] || 'nodeo.json';

var conf = fs.readFileSync( conf_file );

var log = [];

if ( !conf ) {
    throw "Problems with conf file";
}
var chromosome_size = conf.l*conf.fitness.traps;

var trapf = new trap.Trap( conf.fitness );

var eo = new nodeo.Nodeo( { population_size: conf.population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: trapf } );


app.get('/get/best', function(req, res){
    res.send({ chromosome : eo.population[0],
	       fitness : eo.fitness_of[eo.population[0]]});
});

process.nextTick( generations );
app.listen( conf.port ) ;
console.log( "Listening on " +conf.port );

function generations( ) {
    var generation_count = 0;
    do {
	eo.generation();
    } while ( (eo.fitness_of[eo.population[0]] < traps*b ) && ( generation_count++ < conf.generation_run));
    console.log({ chromosome : eo.population[0],
		  fitness : eo.fitness_of[eo.population[0]]});
    if (generation_count > generation_run ) {
	console.log( " Next " );
    } else {
	console.log("Finished\n");
    }
}

