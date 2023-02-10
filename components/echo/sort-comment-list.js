import useGetList from './get-list'
const { $showLoading } = useNuxtApp()

export default (store) => {
  const { getCommentList } = useGetList(store)
  
  const sortCommentList = async (val) => {
    store.setData('comment', {
      orderBy: val
    })
    
    page = 1
    const loadingMessage = $showLoading()
    try {
      await getCommentList(page)
    } finally {
      loadingMessage.close()
    }
  }
  
  return {
    sortCommentList
  }
}