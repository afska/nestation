#!/bin/bash

function try {
	"$@"
	local status=$?
	if [ $status -ne 0 ]; then
		echo "!!!Error!!! with $1" >&2
		exit $status
	fi
	return $status
}