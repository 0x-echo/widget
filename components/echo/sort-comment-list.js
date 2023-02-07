const { $showLoading } = useNuxtApp()

export default () => {
  const sortCommentList = async (val) => {
    orderBy = val
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