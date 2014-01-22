#!/bin/bash

node trap-rest.js conf-x:1.json & 
node trap-rest.js conf-x:2.json &
node trap-rest.js conf-x:3.json &
node trap-rest.js conf-x:4.json &