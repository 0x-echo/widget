import { echoMessage } from '~~/libs/helper'
import commonConfig from '@/config'
import useLibs from './libs'

export default (store) => {
  const { getCommonHeader } = useLibs(store)
  let currentComment = null
  
  const openDeleteCommentDialog = (data) => {
    currentComment = data
    store.setData('deleteCommentDialogVisible', true)
  }
  
  const deleteComment = async () => {
    console.log('go delete', currentComment, currentComment.id)
    try {
      const rs = await $fetch(commonConfig.api().DELETE_POST + currentComment.id, {
        method: 'DELETE',
        headers: getCommonHeader()
      })
      store.widgetData.comments.forEach(item => {
        if (item.id === currentComment.id) {
          item.is_deleted = true
        }
      })
      currentComment = null
      store.setData('deleteCommentDialogVisible', false)
      echoMessage.success({
        message: 'Done.'
      })
    } catch (e) {
      if (e.response && e.response._data) {
        echoMessage.error({
          message: e.response._data.msg
        })
      } else {
        echoMessage.error({
          message: 'Indexer error.'
        })
      }
    }
  }
  
  return {
    openDeleteCommentDialog,
    deleteComment
  }
}