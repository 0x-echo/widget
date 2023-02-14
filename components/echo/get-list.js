import { ElMessage } from 'element-plus'
import commonConfig from '@/config'
import useLibs from './libs'

export default (store) => {
  const { getCommonHeader } = useLibs(store)
  
  let hasLoaded = ref(false)
  const commentSize = 20
  let comments = reactive([])

  const getCommentList = async (page = 1, since, parentId) => {
    if (store.comment.onFetchList) {
      return
    } else {
      store.setData('comment', {
        onFetchList: true
      })
      
      if (!parentId && !since) {
        if (page > 1) {
          store.setData('comment', {
            isLoadingMore: true
          })
        }
      }
    }
  
    const params = {
      target_uri: store.widgetConfig.targetUri,
      since,
      page,
      order_by: store.comment.orderBy
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
            comments = [...rs.list, ...store.widgetData.comments]
          }
        } else {
          if (page === 1) {
            comments = rs.list
          } else {
            comments = [...store.widgetData.comments, ...rs.list]
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
  
        store.setData('widgetData', {
          comments: comments
        })
  
        store.setCounts(rs.target_summary)
        if (page === 1) {
          store.setLastGotTime(new Date().getTime())
          store.setNewPost(0)
          store.setData('comment', {
            hasMore: rs.total > commentSize,
            isLoadingMore: false,
            localUpdateCommentIds: []
          })
        } else {
          store.setData('comment', {
            hasMore: rs.total > ((page - 1) * commentSize + rs.list.length),
            isLoadingMore: false
          })
        }
      } else {
        store.widgetData.comments.forEach(one => {
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
        store.setData('status', {
          loading: false
        })
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
    
    store.setData('comment', {
      onFetchList: false
    })
  }
  
  const reactionLimit = 50
  const getReactionList = async (subType) => {
    if ((subType === 'like' && !store.like.hasMore) || (subType === 'dislike' && !store.dislike.hasMore)) {
      return
    }
    const page = subType === 'like' ? store.like.page : store.dislike.page
    const params = {
      target_uri: store.widgetConfig.targetUri,
      page,
      limit: reactionLimit,
      sub_type: subType
    }

    try {
      store.setData(subType, {
        isLoadingMore: true
      })
      
      const { data: rs }= await $fetch(commonConfig.api().GET_REACTIONS, {
        params,
        headers: getCommonHeader()
      })
      console.log(rs)
      if (page === 1) {
        store.widgetData[subType + 's'] = rs.list
      } else {
        store.widgetData[subType + 's'].push(...rs.list)
      }
      const hasMore = ((page - 1) * reactionLimit + rs.list.length) < rs.total
      store.setData(subType, {
        hasMore
      })
      // hasMoreLikes.value = hasMore
      store.setCounts(rs.target_summary)
      if (subType === 'like') {
        store.setData('like', {
          page: store.like.page + 1
        })
      } else if (subType === 'dislike') {
        store.setData('dislike', {
          page: store.dislike.page + 1
        })
      }
    } catch (e) {
      console.log(e)
    }
    
    store.setData(subType, {
      isLoadingMore: false
    })
  }
  
  const getTipList = async () => {
    const params = {
      target_uri: store.widgetConfig.targetUri,
      unique: true
    }
  
    try {
      const { data: rs }= await $fetch(commonConfig.api().GET_TIPS, {
        params,
        headers: getCommonHeader()
      })
      store.widgetData['tips'] = rs.list
      store.setCounts(rs.target_summary)
    } catch (e) {
      console.log(e)
    }
  }
  
  return {
    getCommentList,
    getReactionList,
    getTipList
  }
}