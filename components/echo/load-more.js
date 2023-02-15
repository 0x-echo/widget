import useGetList from './get-list'


export default (store) => {
  const { getCommentList, getReactionList } = useGetList(store)
  
  const loadMore = async (activeTab) => {
    if (activeTab === 'comment') {
      await loadMoreComments()
    } else if (activeTab === 'like') {
      await loadMoreLikes()
    }
  }
  
  const loadMoreComments = async () => {
    if (!store.comment.onFetchList && store.comment.hasMore) {
      await getCommentList(++store.comment.page)
    }
  }
  
  const loadMoreLikes = async () => {
    await getReactionList('like')
  }
  
  const loadReplyChildren = async (id, parentPost) => {
    store.setData('isLoadingReplyChildren', true)
    parentPost.current_reply_page++
    await getCommentList(parentPost.current_reply_page, null, id)
    parentPost.is_expanded = true
    store.setData('isLoadingReplyChildren', false)
  }
  
  return {
    loadMore,
    loadReplyChildren
  }
}