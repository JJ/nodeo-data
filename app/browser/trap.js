#!/usr/bin/env node

var nodeo = require('../../lib/nodeo.js'),
trap = require('../../lib/trap.js');

var conf = {  "max_evaluations": 1000000,
	      "population_size": 512,
	      "fitness": { "l": 4, 
			   "a": 1, 
			   "b": 2, 
			   "z": 3,
			   "traps": 40 }
	   };

var traps = conf.fitness.traps;
var chromosome_size = conf.fitness.l*traps;
var log = [];
log.push( conf );
var total_generations = 0;

var trapf = new trap.Trap( conf.fitness );

var eo = new nodeo.Nodeo( { population_size: conf.population_size,
				chromosome_size: chromosome_size,
				fitness_func: trapf } );

log.push( { start: process.hrtime() } );
console.log( "Starting ");
var generation_count=0;
do {
    eo.generation();
    generation_count++;
} while ( (eo.fitness_of[eo.population[0]] < traps*conf.fitness.b ) && ( generation_count*conf.population_size < conf.max_evaluations));

log.push( {end: { 
	       evaluations: generation_count*conf.population_size,
	       best : { chromosome : eo.population[0],
			fitness : eo.fitness_of[eo.population[0]]}}} );
console.log( "Finished ", log );
console.log(  eo.population[0] );


