import useGetList from './get-list'
const { $showLoading } = useNuxtApp()

export default (store) => {
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