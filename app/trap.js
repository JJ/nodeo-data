#!/usr/bin/env node

var nodeo = require('../lib/nodeo.js'),
trap = require('../lib/trap.js');

var l = 4,
traps = 64;
var population_size = 256;
var a = 1, b = 2, z = l-1;
var chromosome_size = l*traps;
var population = [];
var fitness_of = {};
var tournament_size = 2;
var pool_size = population_size;

var trapf = new trap.Trap( { l: l, a: a, b: b, z: z } );

var eo = new nodeo.Nodeo( { population_size: population_size,
			    chromosome_size: chromosome_size,
			    fitness_func: trapf } );

do {
    eo.generation();
    console.log(eo.population[0]+ " Fitness " + eo.fitness_of[eo.population[0]]);
} while ( eo.fitness_of[eo.population[0]] < traps*b );

