<template>
  <el-dialog
    v-bind="$attrs"
    :close-on-click-modal="false"
    custom-class="dialog-donate"
    :show-close="false"
    top="10vh"
    width="580px">
    <template
      #title>
      <dialog-header
        icon="ri-hand-heart-line"
        title="Donate"
        @close="close">
      </dialog-header>
    </template>
    
    <section-user
      :data="user">
    </section-user>
    
    <section-network
      v-model="data.network">
    </section-network>
    
    <section-amount
      v-model="data.amount">
    </section-amount>
    
    <div
      class="dialog-donate__footer">
      <div
        class="dialog-donate__tip">
        * non-refundable donation
      </div>
      
      <el-button
        class="dialog-donate__next-button"
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
import { ElButton, ElDialog } from 'element-plus/dist/index.full'
import SectionAmount from './section-amount'
import SectionNetwork from './section-network'
import SectionUser from './section-user'

const emits = defineEmits([
  'update:modelValue'
])

const close = () => {
  emits('update:modelValue', false)
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

const data = reactive({
  network: '',
  amount: ''
})
</script>

<script>
export default {
  inheritAttrs: false
}
</script>


<style lang="scss">
.dialog-donate {
  section + section {
    margin-top: 30px;
  }
  
  &__section-title {
    margin-bottom: 20px;
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
    border: 1px solid #E2E8ED;
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      border-color: $primary;
      box-shadow: 0 0 4px rgba($primary, .5);
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
    color: $text-secondary;
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
    text-align: center;
    color: $text-muted;
  }
  
  &__next-button {
    width: 100px;
  }
}
</style>