import { ElMessage } from 'element-plus'
import { setDraft } from '@/libs/helper'
import { parseContent } from '@/libs/content-parser'
import { v4 as uuidv4 } from 'uuid'
import useConfetti from '~~/compositions/confetti'
import useLibs from './libs'
import useSign from '~~/compositions/sign'

const { showConfetti } = useConfetti()
const sign = useSign()

export default (store) => {
  const { $bus } = useNuxtApp()
  const { getCommonHeader } = useLibs(store)
  
  const comment = async (message) => {
    if (!message.value) {
      ElMessage.error({
        message: 'Please type something'
      }) 
      
      return
    }
  
    await doReply(message.value, null, function () {
      message.value = ''
      setDraft(store.widgetConfig.targetUri, '')
      store.setData('comment', {
        counts: store.comment.counts + 1
      })
    })
  }
  
  const replyComment = async (data) => {
    if (!data.message) {
      ElMessage.error({
        message: 'Please type something'
      }) 
      
      return
    }
    
    await doReply(data.message, data.data.id, null)
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
 
     if (rs.data.is_first_comment) {
       ElMessage.success({
         message: 'Congrats on your first echo!'
       })
       showConfetti()
     } else {
       ElMessage.success({
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
       summary.comments.unshift(rs.data.post)
     } else {
       summary.comments.find(one => one.id === rs.data.post.parent_id).replies.push(rs.data.post)
     }
   } catch (e) {
     console.log(e)
     if (e.response && e.response._data) {
       ElMessage.error({
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