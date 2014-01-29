#!/bin/bash

N=$1
CONF=$2

for i in {1..30}
do
    echo "Test $i"
    node pool-rest.js &
    PID_POOL=$!
    for j in $(seq $N)
    do
	id=$((j - 1))
	echo "Starting $id"
	node trap-rest-client.js $CONF $id $i & 
	PID[$j]=$!
    done
    for j in $(seq $N)
    do
	wait ${PID[$j]}
    done
    kill $PID_POOL
done
