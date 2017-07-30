# IPFS start playing!

- Can I bootstrap a discovery system off IPFS
- Can I sync scrobblecast data back through IPFS?

## References
- [Getting Started](https://ipfs.io/docs/getting-started/)
- [docker hub official images](https://hub.docker.com/r/ipfs/go-ipfs/)

## TODO

- Bootstrap a pair of private nodes (docker-compose)
- Figure out discovery....

## Digital Ocean
```
./up-digitalocean.sh
eval "$(docker-machine env ipfs-digitalocean)"
open http://$(docker-machine ip ipfs-digitalocean):8080/

./down.sh
```

## Docker
_Note: ipfs is the name of the container, executable and alias!_
```
# - to mount volumes
mkdir -p data/export data/ipfs
chmod a+rwx data/export data/ipfs
docker run -d --name ipfs -v $(pwd)/data/export:/export -v $(pwd)/data/ipfs:/data/ipfs -p 8080:8080 -p 4001:4001 -p 5001:5001 ipfs/go-ipfs:latest

# - no volumes
docker run -d --name ipfs -p 8080:8080 -p 4001:4001 -p 5001:5001 ipfs/go-ipfs:latest

# - alias
alias ipfs='docker exec -i ipfs ipfs'

# - webui
open http://localhost:5001/webui
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

## Share unique content
```
hash=`echo "I <3 IPFS -$(whoami)@$(hostname)" | ipfs add -q`
echo curl "https://ipfs.io/ipfs/$hash"
curl "https://ipfs.io/ipfs/$hash"
```

## Add a website
```
# - copy into docker shared folder
scp -rp demo-content/helium-logo data/export

ipfs add -r /export/helium-logo
added    helium-logo

open http://localhost:8080/ipfs/QmRF5vi2ugpNmTJ7683FFqG9wGh7xkm9dmPi7cAjKoa24Z
open https://ipfs.io/ipfs/QmRF5vi2ugpNmTJ7683FFqG9wGh7xkm9dmPi7cAjKoa24Z

# - remove
ipfs pin rm QmRF5vi2ugpNmTJ7683FFqG9wGh7xkm9dmPi7cAjKoa24Z
ipfs repo gc
```

### Publish to dns

First, set DNS `TXT` record for `scrobblecast.imetrical.net` to `dnslink=/ipfs/QmRF5vi2ugpNmTJ7683FFqG9wGh7xkm9dmPi7cAjKoa24Z`
```
aws --profile 'im-dan' route53 list-hosted-zones
# - imetrical.net: Z39YZRE7V34H1A
# - get current value
aws --profile 'im-dan' route53 list-resource-record-sets --hosted-zone-id Z39YZRE7V34H1A --query "ResourceRecordSets[?Name == 'scrobblecast.imetrical.net.']" |jq -r .[].ResourceRecords[].Value
# - set (see cdb-infra.sh)

# - open locally
open http://localhost:8080/ipns/scrobblecast.imetrical.net/
# - open remote
open https://ipfs.io/ipns/scrobblecast.imetrical.net/

```