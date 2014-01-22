#!/usr/bin/env node

var fs=require('fs');

// generates conf

var how_many_peers = process.argv[2];
var prefix = process.argv[3];
var total_population = process.argv[4];
var default_params_file = process.argv[5];

var conf = JSON.parse(fs.readFileSync( default_params_file, 'utf8' ));

var indices=[];
for ( var i = 0; i < how_many_peers; i ++ )
    indices.push( i );

var all_peers = indices.map( function( one ) {
    return "http://localhost:"+(parseInt(conf.port)+one);
});

console.log( all_peers);

for (var i in indices ) {
    var this_conf = JSON.parse(JSON.stringify(conf)); // cheap clone
    this_conf.port = (parseInt(this_conf.port) + parseInt(i));
    this_conf.population_size = total_population/how_many_peers;
    this_conf.peers = all_peers.slice(0);
    this_conf.peers.splice(i, 1);
    this_conf.output = prefix+":"+i+".json";
    fs.writeFileSync("conf-"+prefix+":"+i+".json", 
		     JSON.stringify(this_conf));
}