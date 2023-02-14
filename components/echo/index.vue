<template>
  <div
    ref="widget"
    class="echo-widget"
    :class="widgetClass"
    :style="widgetStyle">
    <template 
      v-if="widgetType === 'mix-widget' || widgetType === 'comment-only'">
      <echo-module-tabs
        :data="store.widgetData"
        :loading="store.status.loading"
        :modules="currentModules"
        v-model="store.comment.message"
        @delete-comment="openDeleteCommentDialog"
        @connect-wallet="openConnectWalletDialog"
        @dislike="dislike"
        @dislike-comment="dislikeComment"
        @like="like"
        @like-comment="likeComment"
        @logout="logout"
        @on-change-tab="onChangeTab"
        @refresh-comment-list="refreshCommentList"
        @refresh-profile="refreshProfile"
        @comment="comment"
        @reply-comment="replyComment"
        @report="openReportDialog"
        @view-arweave-info="viewArweaveInfo"
        @sort-change="sortCommentList"
        @tip="openTipDialog"
        @load-more="loadMore"
        @load-reply-children="loadReplyChildren">
      </echo-module-tabs>

      <echo-footer
        v-if="!store.status.loading"
        @logout="logout"
        @refresh-profile="refreshProfile">
      </echo-footer>
    </template>
    
    <echo-toolbar
      v-if="widgetType === 'lite-only'"
      :loading="store.status.loading"
      :modules="currentModules"
      @connect-wallet="store.setData('connectWalletDialogVisible', true)"
      @tip="openTipDialog"
      @dislike="dislike"
      @logout="logout"
      @like="like"
      @refresh-profile="refreshProfile">
    </echo-toolbar>

    <echo-module-sole
      v-if="['like-only', 'dislike-only', 'tip-only'].includes(widgetType)"
      :data="widgetData"
      :loading="store.status.loading"
      :module="currentModules[0]"
      @dislike="dislike"
      @like="like"
      @logout="logout"
      @tip="openTipDialog">
    </echo-module-sole>
    
    <echo-dialog-connect
      v-model="store.connectWalletDialogVisible"
      @connect-wallet="connectWallet">
    </echo-dialog-connect>
    
    <echo-dialog-tip
      v-model="store.tipDialogVisible"
      @choose-tip-wallet="store.setData('connectWalletDialogVisible', true)"
      @do-tip="doTipLogin">
    </echo-dialog-tip>
    
    <echo-dialog-report
      v-model="store.reportDialogVisible"
      @submit="submitReport">
    </echo-dialog-report>
    
    <base-dialog-confirm
      confirm-button-text="Delete"
      confirm-button-type="danger"
      title="Delete Comment?"
      title-icon="ri-close-circle-line"
      v-model="store.deleteCommentDialogVisible"
      @submit="deleteComment">
      <p>
        The action cannot be undone.
      </p>
      
      <p>
        The post cannot be deleted after it goes on-chain in about 5 minutes.
      </p>
    </base-dialog-confirm>
  </div>
</template>

<script setup>
import useStore from '~~/store'
const store = useStore()

// libs
import { getDraft, setDraft } from '@/libs/helper'
import commonConfig from '@/config'
import useLibs from './libs'
const { getCommonHeader } = useLibs(store)

// connect wallet / disconnect wallet
import useConnectWallet from './connect-wallet'
const { connectWallet, openConnectWalletDialog } = useConnectWallet(store)

import useTryAutoLogin from './try-auo-login'
const { tryAutoLogin } = useTryAutoLogin(store)

// get widget data
import useGetWidgetData from './get-widget-data'
const { getWidgetData } = useGetWidgetData(store)

// get list
import useGetList from './get-list'
const { getCommentList, getReactionList, getTipList } = useGetList(store)

// load more 
import useLoadMore from './load-more'
const { handleBodyScroll, loadMore, loadReplyChildren } = useLoadMore(store)

// refresh comment list
import useRefreshCommentList from './refresh-comment-list'
const { refreshCommentList } = useRefreshCommentList(store)

// sort comment list 
import useSortCommentList from './sort-comment-list'
const { sortCommentList } = useSortCommentList(store)

// comment 
import useComment from './comment'
const { comment, replyComment } = useComment(store)

// delete comment 
import useDeleteComment from './delete-comment'
const { openDeleteCommentDialog, deleteComment } = useDeleteComment(store)

// like + dislike
import useDoReaction from './do-reaction'
const { like, likeComment, dislike, dislikeComment } = useDoReaction(store)

// tip
import useTip from './tip'
const { openTipDialog, doTipLogin, submitTip } = useTip(store)

// report
import useReport from './report'
const { openReportDialog, submitReport } = useReport(store)

// view arweave info
import useViewArweaveInfo from './view-arweave-info'
const { viewArweaveInfo } = useViewArweaveInfo()

// refresh profile 
import useRefreshProfile from './refresh-profile'
const { refreshProfile } = useRefreshProfile(store)

// logout 
import useLogout from './logout'
const { logout } = useLogout(store)

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const widgetClass = computed(() => {
  const config = props.config
  
  return {
    'dark': store.env.colorTheme === 'dark',
    'has-h-padding': config['has-h-padding'],
    'has-v-padding': config['has-v-padding'],
    'no-padding-in-mobile': config['no-padding-in-mobile'],
    [`target-site-${config['target-site']}`]: config['target-site'] !== ''
  }
})

const widgetStyle = computed(() => {
  let list = {}
  const config = props.config
  
  if (config['color-theme'] === 'dark' && config['dark-theme-bg-color']) {
    list['--echo-theme-bg-color'] = config['dark-theme-bg-color']
    list.background = config['dark-theme-bg-color']
  }
  
  if (config.height) {
    list.height = `${config.height}px`
  }

  return list
})

const modulesOrder = {
	comment: 1,
	like: 2,
	'like-lite': 3,
	dislike: 4,
	'dislike-lite': 5,
	tip: 6
}

const currentModules = computed(() => {
  const modules = props.config.modules
  modules && modules.sort((a, b) => {
		return modulesOrder[a] > modulesOrder[b] ? 1 : -1
	})
  
  return modules
})

const widgetType = computed(() => {
  const modules = currentModules.value
  let type = ''
  let liteCount = 0
  modules.forEach(item => {
    if (item.endsWith('lite')) {
      liteCount++
    }
  })
  
  if (modules.length === liteCount) {
    type = 'lite-only'
  } else {
    if (modules.length === 1) {
      type = `${modules[0]}-only`
    } else {
      type = 'mix-widget'
    }
  }
  
  store.setData('widgetType', type)
  
  return type
})

const message = computed(() => store.comment.message)
watch(message, (val) => {
  setDraft(store.widgetConfig.targetUri, val)
})

let onHandlingStorageChange = false

const handleStorageChange = () => {
  if (onHandlingStorageChange) {
    return
  }
  if (store.status.loginOnCurrentPage) {
    return
  }
  onHandlingStorageChange = true
  try {
    const loginInfo = localStorage.getItem('login_info')
    if (loginInfo) {
      tryAutoLogin()
    } else {
      // console.log('do logout')
      // logout(true)
    }
  } catch (e) {
    console.log(e)
  }
  onHandlingStorageChange = false
}

const CHECK_INTERVAL = 60 * 1000
let checkInterval = null

onMounted(async () => {
  window.addEventListener('scroll', handleBodyScroll)
  window.addEventListener('storage', handleStorageChange)
  
  const modules = currentModules.value

  if (modules.includes('comment')) {
    const draft = getDraft(store.widgetConfig.targetUri)
    if (draft) {
      store.comment.message = draft
    }

    checkInterval = setInterval(async () => {
      try {
        const { data } = await $fetch(commonConfig.api().CHECK_POST, {
          params: {
            target_uri: store.widgetConfig.targetUri,
            since: store.last_got_time,
            exclude_ids: store.comment.localUpdateCommentIds.join(',')
          },
          headers: getCommonHeader()
        })
        store.setNewPost(data.count)
      } catch (e) {}
    }, CHECK_INTERVAL)
  } else {
    await getWidgetData()
  }

  window.ethereum && window.ethereum.on('accountsChanged', async (accounts) => {
    console.log('account changed', accounts)
    store.setData('wallet', {
      connectedWallets: accounts
    })
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleBodyScroll)
  window.removeEventListener('storage', handleStorageChange)
  
  checkInterval && clearInterval(checkInterval)
})

// init
const init = async () => {
  const modules = currentModules.value
  const firstModule = currentModules.value[0]
  if (firstModule === 'comment') {
    await getCommentList()
    if (modules.includes('like')) {
      await getReactionList('like')
    }
    if (modules.includes('dislike')) {
      await getReactionList('dislike')
    }
    if (modules.includes('tip')) {
      await getTipList()
    }
  }
  if (firstModule === 'like') {
    await getReactionList('like')
  }
  if (firstModule === 'dislike') {
    await getReactionList('dislike')
  }
  if (firstModule === 'tip') {
    await getTipList()
  }
}

init().then(() => {})

const initWallet = async () => {
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) {
      store.setData('wallet', {
        connectedWallets: accounts
      })
    }
  } catch (e) {}
}

initWallet().then(() => {})

// tab
let currentTab = currentModules.value[0]
store.setLayout({
  currentTab
})

const onChangeTab = async (val) => {
  currentTab = val
  store.setLayout({
    currentTab
  })
  if (val === 'tip') {
    await getTipList()
  }
  if (val === 'like') {
    await getReactionList('like')
  }
  if (val === 'dislike') {
    await getReactionList('dislike')
  }
  if (val === 'tip') {
    await getTipList()
  }
}

tryAutoLogin()
</script>

<style lang="scss">
.echo-widget {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--echo-text-color-primary);
  font-family: var(--echo-font-family);
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
  
  [class^="target-site-"] &,
  [class*=" target-site-"] & {
    padding: 25px 20px;
    
    .chat-footer {
      padding-bottom: 0;
    }
  }
  
  &.has-v-padding {
    padding-top: 30px;
  }
  
  &.has-h-padding {
    padding-right: 30px;
    padding-left: 30px;
  }
  
  &__editor {
    margin-bottom: 30px;
  }
}

#confetti-canvas {
  pointer-events: none;
  display: none;
  position: fixed;
  width: 100%;
  height: 120%;
  left: 0;
  top: -20%;
  z-index: 9999;
}

.walletconnect-qrcode {
  &__base {
    overflow: scroll !important;
  }
  
  &__text {
    display: none !important;
  }
  
  &__image {
    max-width: 300px;
  }
}

.walletconnect-modal {
  &__base {
    width: 80vh !important;
    max-width: 348px !important;
    top: 10vh !important;
    transform: none !important;
  }
  
  &__footer {
    margin-top: 10px !important;
  }
}

.walletconnect-connect {
  &__buttons__wrapper__wrap {
    grid-template-columns: repeat(2, 1fr) !important;
  } 
  
  &__button__icon_anchor {
    width: 50% !important;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .echo-widget {
    .has-v-padding & {
      padding-top: 16px;
    } 
    
    .has-h-padding & {
      padding-right: 16px;
      padding-left: 16px;
    }
    
    .no-padding-in-mobile & {
      padding: 0 !important;
    }
  }
}

@media screen and (max-width: 500px) {
  .walletconnect-modal {
    &__base {
      max-width: 80vw !important;
    }
  }
}
</style>