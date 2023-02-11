import useGetList from './get-list'

export default (store) => {
  const { $showLoading } = useNuxtApp()
  const { getCommentList } = useGetList(store)
  
  const refreshCommentList = async () => {
    const loadingMessage = $showLoading()
  
    try {
      await getCommentList(1, store.last_got_time)
    } finally {
      loadingMessage.close()
    }
  }
  
  return {
    refreshCommentList
  }
}