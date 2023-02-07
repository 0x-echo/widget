import { ElMessage } from 'element-plus'

export default (store) => {
  let hasLoaded = ref(false)
  let onFetch = false
  let totalPage = 1
  let limit = 20
  let orderBy = 'newest'
  const commentSize = 20
  let comments = reactive([])

  const getCommentList = async (page = 1, since, parentId) => {
    if (onFetch) {
      return
    } else {
      onFetch = true
      if (!parentId && !since) {
        if (page > 1) {
          store.setData('comment', {
            isLoadingMore: true
          })
        }
      }
    }
  
    const params = {
      target_uri: TARGET_URI,
      since,
      page,
      order_by: orderBy
    }
  
    if (parentId) {
      params.parent_id = parentId
    }
  
    try {
      const { data: rs }= await $fetch(commonConfig.api().GET_POST, {
        params,
        headers: getCommonHeader()
      })
      
      if (!parentId) {
        if (since) {
          for (let i in rs.list) {
            comments = [...rs.list, ...summary.comments]
          }
        } else {
          if (page === 1) {
            comments = rs.list
          } else {
            comments = [...summary.comments, ...rs.list]
          }
        }
  
        // add stat to replies
        comments.forEach(one => {
          if (!one.current_reply_page) {
            one.current_reply_page = 0
            one.is_expanded = false
          }
          
          if (one.from_uri) {
            if (/opensea\.io/i.test(one.from_uri)) {
              one.from_app = 'OpenSea'
            }
            if (/looksrare\.org/i.test(one.from_uri)) {
              one.from_app = 'LooksRare'
            }
            if (/x2y2\.io/i.test(one.from_uri)) {
              one.from_app = 'X2Y2'
            }
            if (/element\.market/i.test(one.from_uri)) {
              one.from_app = 'element'
            }
          }
        })
  
        summary.comments = comments
        summary.counts = rs.target_summary
  
        store.setCounts(rs.target_summary)
        if (page === 1) {
          totalPage = Math.ceil(rs.total / limit)
          store.setLastGotTime(new Date().getTime())
          store.setNewPost(0)
          localUpdateCommentIds = []
          store.setData('comment', {
            hasMore: rs.total > commentSize,
            isLoadingMore: false
          })
        } else {
          store.setData('comment', {
            hasMore: rs.total > ((page - 1) * commentSize + rs.list.length),
            isLoadingMore: false
          })
        }
      } else {
        summary.comments.forEach(one => {
          if (one.id === parentId) {
            if (page === 1) {
              one.replies = rs.list
            } else {
              one.replies = [...one.replies, ...rs.list]
            }
          }
        })
      }
  
      if (!hasLoaded.value) {
        hasLoaded.value = true
        loading.value = false
      }
    } catch (e) {
      if (e.response && e.response._data) {
        ElMessage.error({
          message: e.response._data.msg
        })
      } else {
        ElMessage.error({
          message: 'Indexer error.'
        })
      }
    }
    onFetch = false
  }
  
  return {
    getCommentList
  }
}