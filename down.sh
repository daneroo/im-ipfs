#!/bin/bash

echo "Removing hosts"

docker-machine rm -f ipfs-digitalocean

echo "Done removing hosts"
echo

echo "List to see if any are left ..."
docker-machine ls