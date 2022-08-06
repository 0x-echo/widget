// const baseURL = 'http://95.216.99.122:9000'
import configParser from "./libs/config-parser"

let baseURL = 'http://127.0.0.1:9000'

export default {
	common: {
		PROTOCOL_VERSION: '0.1'
	},
  supportedNetworks: {
    'EVM/1': 'eth',
    'EVM/137': 'polygon',
    'EVM/10': 'optimism',
    'EVM/1284': 'moonbeam',
    'EVM/56': 'bsc'
  },
	api: () => {
    const config = configParser()
    if (config.rpc_url) {
      // third.chat => sandbox
      if (config.rpc_url.includes('third.chat')) {
        config.rpc_url = 'https://sandbox.0xecho.com'
      }
      baseURL = config.rpc_url.replace(/\/$/, '')
    }
    return {
      BASE_URL: baseURL,
      GET_POST: baseURL + '/api/v1/posts',
      CREATE_POST: baseURL + '/api/v1/posts',
      CHECK_POST: baseURL + '/api/v1/posts/update_check',
      GET_TARGET_SUMMARY: baseURL + '/api/v1/target/summary',
      CREATE_USER: baseURL + '/api/v1/users',
      GET_USER_SCREEN_NAME: baseURL + '/api/v1/users/reverse_records',
      GET_USER_INFO: baseURL + '/api/v1/users/info',
      GET_REACTIONS: baseURL + '/api/v1/reactions',
      SYNC_BALANCE: baseURL + '/api/v1/modules/wallet-balance',
      TIP: baseURL + '/api/v1/tips',
      GET_TIPS: baseURL + '/api/v1/tips',
      CURRENCY: baseURL + '/api/v1/common/currency'
    }
  },
	types: {
		COMMENT: 'comment'
	},
  report: {
    reasons: [ // refer to Youtube report reasons.
      `Unwanted commercial content or spam`,
      `Abuse or harmful`,
      `Pornography or sexually explicit material`,
      `Suicide or self injury`,
      'Misinformation',
      'Other'
    ]
  },
  thirdParty: {
    WALLET_CONNECT_PROJECT_ID: 'f1605890a1bdc2cab216432b1768356d'
  },
  wallet: {
    // auth_message: `I want to authenticate and generate a JWT token at timestamp - TIMESTAMP. `,
    auth_message: `I authorize publishing on ECHO from this device.\n\nTimestamp: TIMESTAMP\nPublic key: PUBLIC_KEY`,
    transaction_check_interval: 3000
  }
}
