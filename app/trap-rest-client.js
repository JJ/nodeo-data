#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
trap = require('../lib/trap.js'),
fs= require('fs'),
rest= require('restler');

var app=express();

var conf_file = process.argv[2] || 'nodeo.json';
var id = process.argv[3] || 0;
var pool_url = process.argv[4] || "http://localhost:5000";
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

log.push( { start: process.hrtime() } );
console.log( "Starting ");

// start running the GA
generations();

var generation_count = 0;
do {
    eo.generation();
    generation_count++;
    if ( generation_count % conf.generation_run === 0 ) {
	rest.get( conf.pool_url+"/best" ).on('success', function(result) {
						 eo.incorporate( result.chromosome );
						 log.push( { new: result.chromosome} );
					     });
	rest.put( conf.pool_url+"/one", eo.population[0] );
    }
} while ( (eo.fitness_of[eo.population[0]] < traps*conf.fitness.b ) && (total_generations*conf.population_size < conf.max_evaluations ));

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


