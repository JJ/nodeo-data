#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js');

var population_size = process.argv[2] || 256;
var chromosome_size = process.argv[3] || 256;
var population = [];
var fitness_of = {};
var tournament_size = 2;
var pool_size = population_size;

var rr = function (chromosome) {
    var fitness = 0;
    for (var i = 0; i < chromosome.length; i+=4 ) {
	var chunk = chromosome.substr(i, 4);
	var ones = (chunk.match(/1/g) || []).length;
	fitness += ( ones == 0 || ones == 4 ); 
    }
    return fitness;
};

var eo = new nodeo.Nodeo( { population_size: population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: rr } );

do {
    eo.generation();
    console.log(eo.population[0]+ " Fitness " + eo.fitness_of[eo.population[0]]);
} while ( eo.fitness_of[eo.population[0]] < chromosome_size/4 );

