#!/bin/bash

for i in {1..30}
do
    echo "Test $i"
    node trap-rest.js conf-a128-256-g10-t30-1.json $i& 
    this_pid=$!
    echo $this_pid
    node trap-rest.js conf-a128-256-g10-t30-2.json $i&
    wait $!
    wait $this_pid
done
