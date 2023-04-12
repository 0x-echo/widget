// import { ParticleNetwork, WalletEntryPosition } from '@particle-network/auth'
// import { ParticleProvider } from '@particle-network/provider'
import { ethers } from 'ethers'
import { particle } from '../config'
import { ElMessage } from 'element-plus'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const { projectId, clientKey, appId } = particle

const particleLogin = async ({ provider, context: { getAuthMessage } }) => {
  while(!window.particleAuth || !window.particleProvider) {
    await sleep(1000)
  }

  const ParticleNetwork = window.particleAuth.ParticleNetwork
  const ParticleProvider = window.particleProvider.ParticleProvider

	const pn = new ParticleNetwork({
		projectId,
		clientKey,
		appId,
		chainName: 'Ethereum', //optional: current chain name, default Ethereum.
		chainId: 1, //optional: current chain id, default 1.
		wallet: {
			//optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
			displayWalletEntry: false, //show wallet entry when connect particle.
			// defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
			supportChains: [ { id: 1, name: 'Ethereum' } ], // optional: web wallet support chains.
			customStyle: {} //optional: custom wallet style
		}
	})

	const particleProvider = new ParticleProvider(pn.auth)
	const ethersProvider = new ethers.providers.Web3Provider(particleProvider, 'any')

  // logout first
  if (pn.auth.isLogin()) {
    try {
      const logout = await pn.auth.logout()
      console.log('logout', logout)
    } catch (e) {
      console.log('logout', e)
    }
  }

	try {
		const rs = await pn.auth.login({
			preferredAuthType: provider //support facebook,google,twitter,apple,discord,github,twitch,microsoft,linkedin etc.
		})
		const info = pn.auth.userInfo()
		console.log('particle user info', info, info.thirdparty_user_info.user_info)

		const from = info.wallets[0].public_address
		const { message, signKeys } = getAuthMessage('EVM', from)
		const msg = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
		const params = [ msg, from ]
		const method = 'personal_sign'

		const sign = await particleProvider
			.request({
				method,
				params,
				from
			})
    return [
      from,
      message,
      sign,
      'EVM',
      signKeys,
      '', // do not need
      {
        wallet: `particle:${provider}`,
        login_user_info: info.thirdparty_user_info.user_info
      }
    ]
	} catch (e) {
		console.log(e)
	}
}

export default () => {
	return {
		particleLogin
	}
}
