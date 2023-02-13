import useGetList from './get-list'
const route = useRoute()

export default (store) => {
  const { getCommentList, getReactionList } = useGetList(store)
  
  // load more when scroll to the bottom of body
  const handleBodyScroll = async () => {
    if (!route.query.height) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        await loadMore(store.layout.currentTab)
      }
    }
  }
  
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
    parentPost.current_reply_page++
    await getCommentList(parentPost.current_reply_page, null, id)
    parentPost.is_expanded = true
  }
  
  return {
    handleBodyScroll,
    loadMore,
    loadReplyChildren
  }
}