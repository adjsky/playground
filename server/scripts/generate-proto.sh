#!/bin/bash

export GOBIN=$PWD/bin
export PATH=$GOBIN:$PATH
protoc --go_out=. --twirp_out=. --proto_path=./.. ../protos/sandbox.proto
