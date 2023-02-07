export default (store) => {
  const loadMore = async (activeTab) => {
    if (activeTab === 'comment') {
      await loadMoreComments()
    } else if (activeTab === 'like') {
      await loadMoreLikes()
    }
  }
  
  const loadMoreComments = async () => {
    if (!onFetch && store.comment.hasMore) {
      await getCommentList(++page)
    }
  }
  
  const loadMoreLikes = async () => {
    console.log('load more likes')
    await getReactions('like')
  }
  
  const loadReplyChildren = async (id, parentPost) => {
    parentPost.current_reply_page++
    await getCommentList(parentPost.current_reply_page, null, id)
    parentPost.is_expanded = true
  }
  
  return {
    loadMore,
    loadReplyChildren
  }
}