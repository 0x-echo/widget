import commonConfig from '@/config'
import { echoMessage } from '~~/libs/helper'
import useConfetti from '~~/compositions/confetti'
import useConnectWallet from './connect-wallet'
import useLibs from './libs'
import useGetList from './get-list'
import useSign from '~~/compositions/sign'
import { v4 as uuidv4 } from 'uuid'

const { showConfetti } = useConfetti()
const sign = useSign()
const { public: { common }} = useRuntimeConfig()

export default (store) => {
  const { checkLoginStatus } = useConnectWallet(store)
  const { getReactionList } = useGetList(store)
  const { getCommonHeader } = useLibs(store)
  
  // like 
  const like = async (data) => {
    const type = (data ? '-' : '') + 'like'
    const rs = await doReaction(type)
    if (rs) {
      if (type === 'like' && store.widgetType === 'like-only') {
        echoMessage.success({
          message: 'Thank you!'
        })
        showConfetti()
      }
      
      store.setData('like', {
        page: 1
      })
      await getReactionList('like')
    }
  }
  
  const likeComment = async (data) => {
    await doReaction((data.has_liked ? '-' : '') + 'like', data)
  }
  
  // dislike
  const dislike = async (data) => {
    store.setData('dislike', {
      page: 1
    })
    await doReaction((data ? '-' : '') + 'dislike')
  }
  
  const dislikeComment = async (data) => {
    await doReaction((data.has_disliked ? '-' : '') + 'dislike', data)
  }
  
  const doReaction = async (subType, data) => {
    try {
      if (!data) {
        store.setData('login', {
          beforeAction: subType
        })
      }
      checkLoginStatus()

      const body = {
        type: 'reaction',
        sub_type: subType,
        target_uri: store.widgetConfig.targetUri,
        parent_id: data ? data.id : null,
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4(),
        from_uri: store.widgetConfig.fromUri || null
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
      return true
    } catch (e) {
      console.log(e)
      if (e.response && e.response._data) {
        echoMessage.error({
          message: e.response._data.msg
        })
      }
      return false
    }
  }

  return {
    like,
    likeComment,
    dislike,
    dislikeComment,
    doReaction
  }
}