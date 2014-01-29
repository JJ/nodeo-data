#!/bin/bash

N=$1
CONF=$2
CONF2=$3
NPLUS=$((N+1))
echo $NPLUS
for i in {1..30}
do
    echo "Test $i"
    for j in $(seq $N)
    do
	id=$((j - 1))
	echo "Starting $id"
	node trap-rest.js $CONF $id $NPLUS $i & 
	PID[$j]=$!
    done
    node trap-rest.js $CONF2 $N $NPLUS $i & 
    PID[$NPLUS]=$!
    for j in $(seq $NPLUS)
    do
	wait ${PID[$j]}
    done
done
