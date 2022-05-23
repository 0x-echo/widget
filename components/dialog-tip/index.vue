<template>
  <el-dialog
    v-bind="$attrs"
    :close-on-click-modal="false"
    custom-class="dialog-tip"
    :show-close="false"
    top="10vh"
    width="90%"
    @close="onCloseDialog">
    <template
      #title>
      <dialog-header
        icon="ri-hand-heart-line"
        title="Tip"
        @close="close">
      </dialog-header>
    </template>
    
    <section-user
      :data="user">
    </section-user>
    
    <section-network
      v-model="data.network">
    </section-network>
    
    <el-collapse-transition>
      <section-amount
        v-show="data.network"
        v-model="data.amount">
      </section-amount>
    </el-collapse-transition>
    
    <div
      class="dialog-tip__footer">
      <div
        class="dialog-tip__tip">
        * non-refundable
      </div>

      <el-button
        class="dialog-tip__next-button"
        :disabled="!(data.network && data.amount)"
        size="large"
        type="primary"
        @click="goNext">
        Next
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue'
import { ElButton, ElDialog, ElCollapseTransition } from 'element-plus'
import SectionAmount from './section-amount'
import SectionNetwork from './section-network'
import SectionUser from './section-user'

import useStore from '~~/store';

const store = useStore()
const { $bus } = useNuxtApp()

const emits = defineEmits([
  'go-next',
  'update:modelValue'
])

const close = () => {
  emits('update:modelValue', false)
}

const onCloseDialog = () => {
  $bus.emit('reset-tip-form', data.data)
  data.network = ''
  data.amount = ''
}

const user = {
  name: 'hello.bit',
  bio: 'Hello world, hello world',
  wallet: [{
    type: 'polygon',
    address: '0x12243532323233456'
  }, {
    type: 'eth',
    address: '0x1323232424243456'
  }]
}

let data = reactive({
  network: '',
  amount: ''
})

const goNext = () => {
  close()
  emits('go-next', data)
} 
</script>

<script>
export default {
  inheritAttrs: false
}
</script>


<style lang="scss">
.dialog-tip {
  &.el-dialog {
    max-width: 580px;
  }
  
  section + section {
    margin-top: 30px;
  }
  
  &__section-header {
    margin-bottom: 20px;
  }
  
  &__section-title {
    font-size: 13px;
    font-weight: 600;
  }
  
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc((100% - 15px) / 2);
    padding: 15px 15px 12px;
    margin-bottom: 15px;
    border-radius: 12px;
    background: white;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      border-color: var(--color-primary);
      box-shadow: 0 0 4px rgba(var(--color-primary-rgb), .5);
    }
  }
  
  &__item-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  
  &__item-label {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color-secondary);
  }
  
  &__item-tag {
    margin-left: 10px;
  }
  
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
  }
  
  &__tip {
    font-size: 12px;
    text-align: left;
    color: var(--text-color-muted);
  }
  
  &__next-button {
    width: 100px;
  }
}
</style>