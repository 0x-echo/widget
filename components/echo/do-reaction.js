export default (store) => {
  const doReaction = async (subType, data) => {
    try {
      if (!data) {
        store.setData('login', {
          beforeAction: subType
        })
      }
      beforePost()

      const body = {
        type: 'reaction',
        sub_type: subType,
        target_uri: TARGET_URI,
        parent_id: data ? data.id : null,
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4(),
        from_uri: props.config.from_uri || null
      }

      const signed = sign.sign(body)

      body.public_key = signed.publicKey
      body.signature = signed.signature

      const rs = await $fetch(commonConfig.api().CREATE_POST, {
        method: 'POST',
        body,
        headers: getCommonHeader()
      })

      // reaction to comment
      if (data && rs.data.parent_summary) {
        for (let i in rs.data.parent_summary) {
          data[i] = rs.data.parent_summary[i]
        }
      }

      if (!data && rs.data.target_summary) {
        store.setCounts(rs.data.target_summary)
      }
      // ElMessage.success({
      //   message: 'Done!'
      // })
      // getCommentList()
      return true
    } catch (e) {
      console.log(e)
      if (e.response && e.response._data) {
        ElMessage.error({
          message: e.response._data.msg
        })
      }
      return false
    }
  }

  return {
    doReaction
  }
}