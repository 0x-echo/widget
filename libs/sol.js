import * as solana from '@solana/web3.js'

let connection = new solana.Connection('https://api.mainnet-beta.solana.com')
// const base58 = require('bs58')

// ;(async () => {
//   try {
//     // let slot = await connection.getSlot();
//     // console.log(slot);
//     // let block = await connection.getBlock(slot);
//     // console.log(block);
//     const rs = await connection.getBalance(base58.decode('61B5f4TFU8jZVypaRmymLXMyy2raqUgfYjuUctv8pQrM'))
//   } catch (e) {
//     console.log(e)
//   }
// })()


export default solana
