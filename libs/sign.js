import { ethers } from 'ethers'
import secp256k1 from 'secp256k1'

class Sign {
  constructor (hexPriviateKey, hexPublicKey) {
    if (!hexPriviateKey) {
      this.privateKey = ethers.utils.randomBytes(32)
    } else {
      this.privateKey = ethers.utils.arrayify(hexPriviateKey)
    }

    if (hexPublicKey) {
      this.publicKey = ethers.utils.arrayify(hexPublicKey)
    }

    this.getPublicKey()
  }

  getPrivateKey (hexlify = false) {
    return hexlify ? ethers.utils.hexlify(this.privateKey) : this.privateKey
  }

  getPublicKey (hexlify = false) {
    if (this.publicKey) {
      return hexlify ? ethers.utils.hexlify(this.publicKey) : this.publicKey
    }
    var compressed = secp256k1.publicKeyCreate(this.privateKey);

    this.compressedPublicKey = compressed

    // this.publicKey =  secp256k1.publicKeyConvert(compressed, false)
    this.publicKey = compressed
    return hexlify ? ethers.utils.hexlify(this.publicKey) : this.publicKey
  }

  sign (msg, hexlify = false) {
    const rs = secp256k1.ecdsaSign(msg, this.privateKey)
    return hexlify ? ethers.utils.hexlify(rs.signature) : rs
  }

  verify (signature, msg) {
    console.log('tyepof', typeof signature)
    if (typeof signature === 'string') {
      signature = ethers.utils.arrayify(signature)
    }
    return secp256k1.ecdsaVerify(signature, msg, this.publicKey)
  }
}

export default Sign