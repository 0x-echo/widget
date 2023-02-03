import qs from 'query-string'

let baseURL = 'https://node1.0xecho.com'

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
    const url = document.location.href.split('?')[1]
    const query = qs.parse(url)
    if (query.rpc_url) {
      // third.chat => sandbox
      if (query.rpc_url.includes('third.chat')) {
        query.rpc_url = 'https://sandbox.0xecho.com'
      }
      baseURL = query.rpc_url.replace(/\/$/, '')
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
      CURRENCY: baseURL + '/api/v1/common/currency',
      DELETE_POST: baseURL + '/api/v1/posts/'
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
    auth_message: `I authorize publishing on ECHO from this device with my account: ADDRESS\n\nI accept the Terms of Service: https://0xecho.com/tos\n\nIssued At: TIMESTAMP\nPublic Key: PUBLIC_KEY`,
    transaction_check_interval: 3000
  }
}
