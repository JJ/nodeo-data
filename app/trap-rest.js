#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
trap = require('../lib/trap.js'),
express = require('express'),
fs= require('fs'),
rest= require('restler');

var app=express();

var conf_file = process.argv[2] || 'nodeo.json';
var id = process.argv[3] || 0;
var peers_max = process.argv[4] || 0;
var series = process.argv[5] || 0;

var conf = JSON.parse(fs.readFileSync( conf_file, 'utf8' ));

// console.log(conf);
var log = [];

if ( !conf ) {
    throw "Problems with conf file";
}

log.push( conf );
var traps = conf.fitness.traps;
var chromosome_size = conf.fitness.l*traps;
var total_generations = 0;

var trapf = new trap.Trap( conf.fitness );

var eo = new nodeo.Nodeo( { population_size: conf.population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: trapf } );

// API Definitions
app.get('/best', function(req, res){
	    res.send({ chromosome : eo.population[0],
		       fitness : eo.fitness_of[eo.population[0]]});
	    log.push( { get: process.hrtime()});
});

// API Definitions
app.put('/one/:chromosome', function(req, res){
    eo.incorporate( req.params.chromosome );
    res.send({ chromosome : eo.population[0],
	       fitness : eo.fitness_of[eo.population[0]]});
    log.push( { put: process.hrtime()});
});

log.push( { start: process.hrtime() } );
//console.log( "Starting on port");
// console.log(3000+parseInt(id));
app.listen( 3000+parseInt(id) ) ;

// generate peers

if ( !conf.peers && peers_max ) {
    conf.peers=[];
    for ( var i = 0; i < peers_max; i ++ ) {
	if ( i != id ) {
	    var port = 3000+i; // hack to force number
	    conf.peers.push( "http://localhost:"+port );
	}
	
    }
}

// start running the GA
generations();

//------------------------------------------------------
function generations( ) {
    var generation_count = 0;
    do {
	eo.generation();
	generation_count++;
    } while ( (eo.fitness_of[eo.population[0]] < traps*conf.fitness.b ) && ( generation_count++ < conf.generation_run));
    if ( conf.peers ) {
	var peer_url = conf.peers[ Math.floor(Math.random()*conf.peers.length )];
//	console.log(peer_url);
	rest.get( peer_url+"/best" ).on('success', function(result) {
//					    console.log('Incorporating ');
//					    console.log(result.chromosome);
					    eo.incorporate( result.chromosome );
					});
    }
    total_generations += generation_count;
    if ( ( generation_count > conf.generation_run ) && ( total_generations*conf.population_size < conf.max_evaluations )  ) {
//	 console.log({ chromosome : eo.population[0],
//		       fitness : eo.fitness_of[eo.population[0]]});
	setImmediate( generations );
    } else {
	log.push( {end: { 
		       time: process.hrtime(),
		       generation: total_generations,
		       best : { chromosome : eo.population[0],
				fitness : eo.fitness_of[eo.population[0]]}}} );
	var file_id = parseInt(id)+1;
	conf.output = conf.output_preffix+"-"+file_id+"-"+series+".json";
	fs.writeFileSync(conf.output, JSON.stringify(log));
	console.log("Finished\n");
	process.exit();
	
    }
}
