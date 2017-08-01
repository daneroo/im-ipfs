var ipfsAPI = require('ipfs-api')
// connect to ipfs daemon API server
// var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
// or using options
// var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})
// or connect with multiaddr
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')

async function main () {
  console.log('api', Object.keys(ipfs.pubsub))

  const topic = 'scrobl'
  const l = await ipfs.pubsub.ls()
  console.log('ls', l)

  const receiveMsg = (msg) => {
    const rest = {
      from: msg.from,
      // data: msg.data.toString(),
      seqno: msg.seqno.toString('hex'),
      topicCIDs: msg.topicCIDs
    }
    console.log('msg', msg.data.toString().trim(), JSON.stringify(rest))
  }
  ipfs.pubsub.subscribe(topic, receiveMsg)

  setInterval(() => {
    ipfs.pubsub.publish(topic, Buffer.from(`hello@${new Date().toISOString()}\n`))
    .catch(err => {
      console.log('pub:err', err)
    })
  }, 1000)
}
main()
