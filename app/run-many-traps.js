#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
trap = require('../lib/trap.js'),
fs= require('fs');

var how_many = process.argv[2] || 30;
var conf_file = process.argv[3] || 'nodeo.json';

var base_conf = JSON.parse(fs.readFileSync( conf_file, 'utf8' ));

if ( !base_conf ) {
    throw "Problems with conf file";
}

for ( var i = 0; i < how_many; i++ ) {
    var conf = JSON.parse(JSON.stringify(base_conf));
    var traps = base_conf.fitness.traps;
    var chromosome_size = conf.fitness.l*traps;
    conf.output=conf.output_preffix+ "-" + i + ".dat";
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
    log.push( { chromosome : eo.population[0],
		fitness : eo.fitness_of[eo.population[0]]});
    log.push( {end: { 
		   time: process.hrtime(),
		   generation: total_generations,
		   best : { chromosome : eo.population[0],
			    fitness : eo.fitness_of[eo.population[0]]}}} );
    fs.writeFileSync(conf.output, JSON.stringify(log));
    console.log("Finished #"+i);

}

console.log( "Finished " + how_many );


