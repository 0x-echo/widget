export default () => {
  const like = async (data) => {
    const type = (data ? '-' : '') + 'like'
    const rs = await doReaction(type)
    if (rs) {
      if (type === 'like' && widgetType.value === 'like-only') {
        ElMessage.success({
          message: 'Thank you!'
        })
        showConfetti()
      }
      likePage = 1
      await getReactions('like')
    }
  }
  
  const likeComment = async (data) => {
    await doReaction((data.has_liked ? '-' : '') + 'like', data)
  }
  
  return {
    like,
    likeComment
  }
}