import useGetList from './get-list'

export default (store) => {
  const { $showLoading } = useNuxtApp()
  const { getCommentList } = useGetList(store)
  
  const refreshCommentList = async () => {
    const loadingMessage = $showLoading()
  
    try {
      await getCommentList(1, store.lastGotTime)
    } finally {
      loadingMessage.close()
    }
  }
  
  return {
    refreshCommentList
  }
}