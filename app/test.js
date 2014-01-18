#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
utils = require('../lib/Utils.js');


var population_size = 256;
var chromosome_size = 256;
var population = [];
var fitness_of = {};
var tournament_size = 2;
var pool_size = population_size;

var eo = new nodeo.Nodeo( { population_size: population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: utils.max_ones } );

do {
    eo.generation();
    console.log( eo.population[0] );
} while ( eo.fitness_of[eo.population[0]] < chromosome_size );

console.log(eo.population);