#!/bin/bash

if [ "$1" == "" ]; then
	echo "usage: sh build.sh env(sandbox or debug or ...)"
	exit 0
fi

ENV=$1

rm -rf dist
mkdir dist
node index.js ${ENV}
grunt
