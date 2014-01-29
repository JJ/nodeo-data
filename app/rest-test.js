#!/usr/bin/env node

var rest= require('restler');

console.log( "Starting ");
// start running the GA
var generation_count = 0;
rest.get( "http://localhost:5000/log").on("success", function( result ) {
					      console.log(result );
});