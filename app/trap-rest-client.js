#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
trap = require('../lib/trap.js'),
fs= require('fs'),
rest= require('restler');

var conf_file = process.argv[2] || 'nodeo.json';
var id = process.argv[3] || 0;
var series = process.argv[4] || 0;
var pool_url = process.argv[5] || "http://localhost:5000";

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

log.push( { start: process.hrtime() } );
console.log( "Starting ");
// start running the GA
var generation_count = 0;

// Start loop
generation();

// ---------------------------------

function generation() {
    generation_count++;
    eo.generation();
    if ( generation_count % conf.generation_run === 0 ) {
//	console.log(generation_count);
	rest.put( pool_url+"/one/" + eo.population[0])
	    .on('complete', function(result) {
		    if ( result instanceof Error ) {
			console.log("Error PUT", result.message );
		    } // else {
		    // 	console.log( "Put", result );
		    // }
		});
	rest.get( pool_url+"/random" )
	    .on('complete', function(result) {
//		    console.log('Getting');
		    if ( result instanceof Error ) {
			console.log("Error GET", result.message );
		    } else {
//			console.log("Incorporation", result.chromosome );
			if ( result.chromosome) {
			    eo.incorporate( result.chromosome );
			    log.push( { new: result.chromosome} );
			}
		    }
		});
    }
    if ( (eo.fitness_of[eo.population[0]] < traps*conf.fitness.b ) && (generation_count*conf.population_size < conf.max_evaluations )) {
	setImmediate(generation);
    } else {
	log.push( {end: { 
		       time: process.hrtime(),
		       generation: total_generations,
		       best : { chromosome : eo.population[0],
				fitness : eo.fitness_of[eo.population[0]]}}} );
	var file_id = parseInt(id)+1;
	conf.output = conf.output_preffix+"-"+file_id+"-"+series+".json";
	fs.writeFileSync(conf.output, JSON.stringify(log));
	console.log("Finished");
    }
}