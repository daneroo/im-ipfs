#!/bin/bash

# from https://github.com/daneroo/docker-storage/tree/master/swarm

function main(){
  setup
  docker-machine create ipfs-digitalocean  
}
function setup(){
  echo "Configuring for ${MACHINE_DRIVER}"
  export MACHINE_DRIVER=digitalocean

  # Credentials
  # get the digital ocean token from the doctl config file
  export DIGITALOCEAN_ACCESS_TOKEN=$(grep access-token ~/.config/doctl/config.yaml|cut -f 2 -d:| tr -d '[:space:]')

  # export DIGITALOCEAN_IMAGE=ubuntu-16-04-x64
  # export DIGITALOCEAN_REGION=nyc3 #default
  export DIGITALOCEAN_REGION=nyc1
  # export DIGITALOCEAN_SIZE=512mb
}

main


