import Sign from '../libs/sign'
import { createHash } from 'sha256-uint8array'

function hashAndUint8array (text) {
  const hex = createHash().update(text).digest("hex")
  const data = new Uint8Array(0)
  const hash = createHash().update(data).digest()
  return hash
}

const PRIVATE_KEY_NAME = 'signing_key'

function sortObjectKeys (obj) {
  return Object.keys(obj).sort().reduce((acc,key)=>{
    if (Array.isArray(obj[key])) {
      acc[key] = obj[key].map(sortObjectKeys)
    }
    if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
      acc[key] = sortObjectKeys(obj[key]);
    }
    else {
      acc[key] = obj[key]
    }
    return acc
  },{})
}

// remove empty values
function cleanObject (obj) {
  for (let i in obj) {
    if (obj[i] === null || obj[i] === '' || typeof obj[i] === 'undefined') {
      delete obj[i]
    } else if (typeof obj[i] === 'object' && obj[i] !== null) {
      cleanObject(obj[i])
    }
  }
  return obj
}

function stringToUint8Array(str){
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
 
  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array
}

export default () => {
  let privateKey = ''

  const generateKeyPair = () => {
    const sign = new Sign()
    const privateKey = sign.getPrivateKey(true)
    const publicKey = sign.getPublicKey(true)
    return {
      privateKey,
      publicKey
    }
  }

  const sign = (msg) => {
    if (!msg) {
      throw new Error('MSG IS REQUIRED')
    }
    let _msg = typeof msg === 'object' ? JSON.stringify(sortObjectKeys(cleanObject(msg))) : msg
    _msg = hashAndUint8array(_msg)
    const signingKey = localStorage.getItem(PRIVATE_KEY_NAME)
    if (!signingKey) {
      throw new Error('SIGNING KEY NOT FOUND. PLEASE DO A RE-LOGIN.')
    }
    const sign = new Sign(signingKey)
    return {
      signature: sign.sign(_msg, true),
      publicKey: sign.getPublicKey(true)
    }
  }

  const save = (key) => {
    localStorage.setItem(PRIVATE_KEY_NAME, key)
  }

  const clear = () => {
    localStorage.removeItem(PRIVATE_KEY_NAME)
  }

  return {
    generateKeyPair,
    sign,
    save,
    clear
  }
}