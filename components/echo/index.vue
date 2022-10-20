<template>
  <div
    ref="widget"
    class="echo-widget">
    <template
      v-if="widgetType === 'mix-widget' || widgetType === 'comment-only'">
      <echo-module-tabs
        :config="config"
        :data="summary"
        :loading="loading"
        v-model="message"
        @delete-comment="goDeleteComment"
        @connect-wallet="goConnectWallet"
        @dislike="dislike"
        @dislike-comment="dislikeComment"
        @like="like"
        @ilike="like"
        @like-comment="likeComment"
        @logout="logout"
        @on-change-tab="onChangeTab"
        @refresh-comments="refreshComments"
        @refresh-profile="refreshProfile"
        @reply="reply"
        @reply-comment="replyComment"
        @report="goReport"
        @view-arweave-info="viewArweaveInfo"
        @sort-change="sortChange"
        @tip="tip"
        @load-children="loadChildren"
        @load-more-comments="loadMoreComments">
      </echo-module-tabs>

      <echo-footer
        v-if="!loading"
        @logout="logout">
      </echo-footer>
    </template>
    
    <echo-toolbar
      v-if="widgetType === 'lite-only'"
      :config="config"
      :loading="loading"
      @connect-wallet="connectDialogVisible = true"
      @tip="tip"
      @dislike="dislike"
      @logout="logout"
      @like="like"
      @refresh-profile="refreshProfile">
    </echo-toolbar>

    <echo-module-sole
      v-if="['like-only', 'dislike-only', 'tip-only'].includes(widgetType)"
      :data="summary"
      :loading="loading"
      :module="config.modules[0]"
      @dislike="dislike"
      @like="like"
      @logout="logout"
      @tip="tip">
    </echo-module-sole>
    
    <dialog-connect
      v-model="connectDialogVisible"
      @connect-wallet="connectWallet">
    </dialog-connect>
    
    <dialog-tip
      v-model="tipDialogVisible"
      @tip-reconnect="tipLogin"
      @do-tip="doTipLogin">
    </dialog-tip>
    
    <dialog-report
      v-model="reportDialogVisible"
      @submit="report">
    </dialog-report>
    
    <dialog-confirm
      confirm-button-text="Delete"
      confirm-button-type="danger"
      title="Delete Comment?"
      title-icon="ri-close-circle-line"
      v-model="deleteDialogVisible"
      @submit="deleteComment">
      <p>
        The action cannot be undone.
      </p>
      
      <p>
        The post cannot be deleted after it goes on-chain in about 5 minutes.
      </p>
    </dialog-confirm>
  </div>
</template>

<script setup>
const props = defineProps({
  modules: {
    type: Array,
    default () {
      return ['comment', 'like', 'dislike', 'tip']
    }
  }
})
</script>

<style lang="scss">
.echo-widget {
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .has-v-padding & {
    padding-top: 30px;
  }
  
  .has-h-padding & {
    padding-right: 30px;
    padding-left: 30px;
  }
  
  &__editor {
    margin-bottom: 30px;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .echo-widget {
    padding: 30px 20px !important; 
    
    .no-padding-in-mobile & {
      padding: 0 !important;
    }
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
</style>