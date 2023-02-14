import { echoMessage, setDraft } from '@/libs/helper'
import { parseContent } from '@/libs/content-parser'
import { v4 as uuidv4 } from 'uuid'
import commonConfig from '@/config'
import useConfetti from '~~/compositions/confetti'
import useConnectWallet from './connect-wallet'
import useLibs from './libs'
import useSign from '~~/compositions/sign'

const { showConfetti } = useConfetti()
const sign = useSign()
const { public: { common }} = useRuntimeConfig()

export default (store) => {
  const { checkLoginStatus } = useConnectWallet(store)
  const { getCommonHeader } = useLibs(store)
  const { $bus } = useNuxtApp()
  
  const comment = async () => {
    if (!store.comment.message) {
      echoMessage.error({
        message: 'Please type something'
      }) 
      
      return
    }
  
    await doReply(store.comment.message, null, function () {
      setDraft(store.widgetConfig.targetUri, '')
      store.setData('comment', {
        counts: store.comment.counts + 1,
        message: ''
      })
    })
  }
  
  const replyComment = async (data) => {
    if (!data.message) {
      echoMessage.error({
        message: 'Please type something'
      }) 
      
      return
    }
    
    await doReply(data.message, data.data.id, null)
    store.widgetData.comments.forEach(item => {
      if (item.id === data.data.id) {
        item.can_delete = false
      }
    })
    $bus.emit('reset-reply-comment', data.data)
  }
  
  const doReply = async (content, directParentId, successCallback, type = 'comment') => {
    try {
     checkLoginStatus()
     if (!directParentId) {
       store.setStatus({
         onSubmitingComment: true
       })
     } else {
       store.setStatus({
         onSubmitingReply: true
       })
     }
 
     const body = {
       type,
       target_uri: store.widgetConfig.targetUri,
       direct_parent_id: directParentId,
       content: parseContent(content, false),
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
 
     if (rs.data.is_first_comment) {
       echoMessage.success({
         message: 'Congrats on your first echo!'
       })
       showConfetti()
     } else {
       echoMessage.success({
         message: 'Echo Sent!'
       })
     }
 
     if (successCallback) {
       successCallback()
     }

     if (!directParentId) {
       store.setData('comment', {
        localUpdateCommentIds: [...store.comment.localUpdateCommentIds, rs.data.post.id]
      })
       store.widgetData.comments.unshift(rs.data.post)
     } else {
      store.widgetData.comments.find(one => one.id === rs.data.post.parent_id).replies.push(rs.data.post)
     }
   } catch (e) {
     console.log(e)
     if (e.response && e.response._data) {
       echoMessage.error({
         message: e.response._data.msg
       })
     }
   } finally {
     if (!directParentId) {
       store.setStatus({
         onSubmitingComment: false
       })
     } else {
       store.setStatus({
         onSubmitingReply: false
       })
     }
   }
 }
  
  return {
    comment,
    replyComment
  }
}