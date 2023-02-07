export default () => {
  const dislike = async (data) => {
    dislikePage = 1
    await doReaction((data ? '-' : '') + 'dislike')
  }
  
  const dislikeComment = async (data) => {
    await doReaction((data.has_disliked ? '-' : '') + 'dislike', data)
  }
  
  return {
    dislike,
    dislikeComment
  }
}