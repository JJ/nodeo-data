#!/bin/bash

N=$1
CONF=$2

for i in {1..30}
do
    echo "Test $i"
    node pool-rest.js &
    PID_POOL=$!
    echo "Starting pool $PID_POOL"
    sleep 1
    for j in $(seq $N)
    do
	id=$((j - 1))
	echo "Starting $id"
	node trap-rest-client.js $CONF $id $i & 
	PID[$j]=$!
    done
    for j in $(seq $N)
    do
	echo "Waiting for $j to finish"
	wait ${PID[$j]}
    done
    echo "Killing $PID_POOL"
    kill $PID_POOL
    wait $PID_POOL
done
