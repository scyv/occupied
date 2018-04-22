#!/bin/sh

cd ..
meteor build .build --server https://occupied.scytec.de --architecture os.linux.x86_64
scp .build/occupied.tar.gz root@scytec:/opt/occupied/current
