# IPFS start playing!


- Can I bootstrap a discovery system off IPFS
- Can I sync scrobblecast data back through IPFS?

## References
- [Getting Started](https://ipfs.io/docs/getting-started/)
- [docker hub official images](https://hub.docker.com/r/ipfs/go-ipfs/)

## TODO

- Bootstrap a pair of private nodes (docker-compose)
- Figure out discovery....

## Docker
_Note: ipfs is the name of the container, executable and alias!_
```
# to mount volumes
mkdir -p data/export data/ipfs
chmod a+rwx data/export data/ipfs
docker run -d --name ipfs -v $(pwd)/data/export:/export -v $(pwd)/data/ipfs:/data/ipfs -p 8080:8080 -p 4001:4001 -p 5001:5001 ipfs/go-ipfs:latest

# no volumes
docker run -d --name ipfs -p 8080:8080 -p 4001:4001 -p 5001:5001 ipfs/go-ipfs:latest

# alias
alias ipfs='docker exec -i ipfs ipfs'
```

## List peeers
```
ipfs swarm peers
```

## show my config (PeerId)
```
ipfs config show
ipfs config show|jq -r '.Identity.PeerID'
```

# Share unique content
```
hash=`echo "I <3 IPFS -$(whoami)@$(hostname)" | ipfs add -q`
echo curl "https://ipfs.io/ipfs/$hash"
curl "https://ipfs.io/ipfs/$hash"

```