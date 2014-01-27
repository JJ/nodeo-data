#!/bin/bash

N=$1
CONF=$2
for i in {1..30}
do
    echo "Test $i"
    for j in $(seq $N)
    do
	id=$((j - 1))
	echo "Starting $id"
	node trap-rest.js $CONF $id $N & 
	PID[$j]=$!
    done
    for j in $(seq $N)
    do
	wait ${PID[$j]}
    done
done
