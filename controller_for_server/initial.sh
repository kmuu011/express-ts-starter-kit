#!/bin/sh
SHELL_PATH=$(dirname $0)

cd $SHELL_PATH

cd ..
cd server

npm ci --force
