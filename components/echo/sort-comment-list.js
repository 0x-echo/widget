import useGetList from './get-list'

export default (store) => {
  const { $showLoading } = useNuxtApp()
  const { getCommentList } = useGetList(store)
  
  const sortCommentList = async (val) => {
    store.setData('comment', {
      orderBy: val,
      page: 1
    })
    
    const loadingMessage = $showLoading()
    try {
      await getCommentList(store.comment.page)
    } finally {
      loadingMessage.close()
    }
  }
  
  return {
    sortCommentList
  }
}