import { ElMessage } from 'element-plus'
import useLibs from './libs'

export default ({ deleteCommentDialogVisible, store }) => {
  const { getCommonHeader } = useLibs(store)
  let currentComment = null
  
  const openDeleteCommentDialog = ({data}) => {
    currentComment = data
    deleteCommentDialogVisible.value = true
  }
  
  const deleteComment = async () => {
    console.log('go delete', currentComment, currentComment.id)
    try {
      const rs = await $fetch(commonConfig.api().DELETE_POST + currentComment.id, {
        method: 'DELETE',
        headers: getCommonHeader()
      })
      currentComment = null
      deleteCommentDialogVisible.value = false
      ElMessage.success({
        message: 'Done.'
      })
    } catch (e) {
      if (e.response && e.response._data) {
        ElMessage.error({
          message: e.response._data.msg
        })
      } else {
        ElMessage.error({
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