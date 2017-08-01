var ipfsAPI = require('ipfs-api')
// connect to ipfs daemon API server
// var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
// or using options
// var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})
// or connect with multiaddr
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')

const start = +new Date()
function int64NanosToDate (seqno) { // seqno is a buffer of 8 bytes
  // generated here: https://github.com/libp2p/go-floodsub/blob/master/floodsub.go#L395
  // binary.BigEndian.PutUint64(seqno, uint64(time.Now().UnixNano()))
  // playground https://play.golang.org/p/90U-u-7sZF

  // const bigInt = (msg.seqno.readUInt32BE(0) << 32) + msg.seqno.readUInt32BE(4)
  const i0 = (seqno.readUInt32BE(0))
  const i1 = (seqno.readUInt32BE(4))
  // going from nanos to millis -> /1e6
  const mult = (1 << 28) / (1e6 >> 4) // == (1<<32)/1e6 which you cannot do in JS!
  const millis = i0 * mult + i1 / 1e6
  // console.log('i0', i0, 'mult', mult, 'i0<<32 / 1e6 :', i0 * mult)
  // console.log('i1', i1, 'i1 / 1e6 :', i1, i1 / 1e6)
  // console.log('millis   :', millis)
  // console.log('stamp    :', new Date(millis))
  return new Date(millis)
}
async function main () {
  console.log('api', Object.keys(ipfs.pubsub))

  const topic = 'scrobl'
  const l = await ipfs.pubsub.ls()
  console.log('ls', l)

  const receiveMsg = (msg) => {
    const rest = {
      // data: msg.data.toString(),
      stamp: int64NanosToDate(msg.seqno),
      from: msg.from,
      seqno: msg.seqno.toString('hex'), // binary.BigEndian.PutUint64(seqno, uint64(time.Now().UnixNano()))
      topicCIDs: msg.topicCIDs
    }
    const elapsed = Math.floor((+new Date() - start) / 1000)
    console.log(`msg(+${elapsed}s)`, msg.data.toString().trim(), JSON.stringify(rest))
  }
  ipfs.pubsub.subscribe(topic, receiveMsg)

  setInterval(() => {
    ipfs.pubsub.publish(topic, Buffer.from(`hello@${new Date().toISOString()}\n`))
      .catch(err => {
        console.log('pub:err', err)
      })
  }, 3000)
}
main()
