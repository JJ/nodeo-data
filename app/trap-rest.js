#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
trap = require('../lib/trap.js'),
express = require('express'),
fs= require('fs');

var app=express();

var conf_file = process.argv[2] || 'nodeo.json';

var conf = JSON.parse(fs.readFileSync( conf_file, 'utf8' ));

console.log(conf);
var log = [];

if ( !conf ) {
    throw "Problems with conf file";
}

log.push( conf );
var traps = conf.fitness.traps;
var chromosome_size = conf.fitness.l*traps;

var trapf = new trap.Trap( conf.fitness );

var eo = new nodeo.Nodeo( { population_size: conf.population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: trapf } );

// Definitions
app.get('/get/best', function(req, res){
	    res.send({ chromosome : eo.population[0],
		       fitness : eo.fitness_of[eo.population[0]]});
	    log.push( { get: process.hrtime()});
});

log.push( { start: process.hrtime() } );
console.log( "Starting ");
console.log( "Listening on " +conf.port );
app.listen( conf.port ) ;
generations();

//------------------------------------------------------
function generations( ) {
    var generation_count = 0;
    do {
	eo.generation();
    } while ( (eo.fitness_of[eo.population[0]] < traps*conf.fitness.b ) && ( generation_count++ < conf.generation_run));
    if (generation_count > conf.generation_run ) {
	 console.log({ chromosome : eo.population[0],
		       fitness : eo.fitness_of[eo.population[0]]});
	setImmediate( generations );
    } else {
	log.push( {end: process.hrtime()} );
	fs.writeFileSync(conf.output, JSON.stringify(log));
	console.log("Finished\n");
	process.exit();
	
    }
}
