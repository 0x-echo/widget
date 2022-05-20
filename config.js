// const baseURL = 'http://95.216.99.122:9000'
const baseURL = 'http://127.0.0.1:9000'

export default {
	common: {
		PROTOCOL_VERSION: '0.0.1'
	},
	api: {
		GET_POST: baseURL + '/api/v1/posts',
		CREATE_POST: baseURL + '/api/v1/posts',
		CHECK_POST: baseURL + '/api/v1/posts/update_check',
		GET_TARGET_SUMMARY: baseURL + '/api/v1/target/summary',
		CREATE_USER: baseURL + '/api/v1/users',
		GET_USER_SCREEN_NAME: baseURL + '/api/v1/users/reverse_records',
    GET_USER_INFO: baseURL + '/api/v1/users/info'
	},
	types: {
		COMMENT: 'comment'
	},
  report: {
    reasons: [
      `It's suspicious or spam`,
      `It's abusive or harmful`,
      `It expresses intentions of self-harm or suicide`,
      'Other'
    ]
  }
}
