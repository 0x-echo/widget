@@ -0,0 +1,105 @@
<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    destroy-on-close
    :show-close="false"
    :width="width">
    <template
      #header>
      <div
        class="echo-dialog__header"
        :class="{
          'is-border-bottom': headerBorderBottom
        }">
        <i
          class="echo-dialog__title-icon"
          :class="titleIcon">
        </i>
        
        <div
          class="echo-dialog__title">
          {{ title }}
        </div>
        
        <el-button
          class="echo-dialog__close"
          v-if="showClose"
          type="info"
          @click="$emit('on-close')">
          <i
            class="ri-close-line">
          </i>
        </el-button>
      </div>
    </template>
    
    <slot>
    </slot>
    
    <div
      class="echo-dialog__footer"
      v-if="hasActionFooter">
      <el-button
        v-if="hasCancelButton"
        @click="$emit('cancel')">
        {{ cancelButtonText }}
      </el-button>
      
      <el-button
        :disabled="confirmButtonDisabled"
        :type="confirmButtonType"
        @click="submit">
        {{ confirmButtonText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElButton, ElDialog } from 'element-plus'

const props = defineProps({
  cancelButtonText: {
    type: String,
    default: 'Cancel'
  },
  confirmButtonDisabled: {
    type: Boolean,
    default: false
  },
  confirmButtonText: {
    type: String,
    default: 'Confirm'
  },
  confirmButtonType: {
    type: String,
    default: 'primary'
  },
  hasCancelButton: {
    type: Boolean,
    default: true
  },
  hasActionFooter: {
    type: Boolean,
    default: false
  },
  headerBorderBottom: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: true
  },
  titleIcon: {
    type: String
  },
  width: {
    type: [Number, String],
    default: '90%'
  }
})

const emits = defineEmits([
  'cancel',
  'on-close',
  'submit'
])

const submit = () => {
  emits('submit')
}
</script>

<style lang="scss">
.echo-dialog {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    &.is-border-bottom {
      padding-bottom: 25px;
      border-bottom: 1px dashed var(--border-color);
    }
  }
    
  &__title-icon {
    margin-right: 12px;
    font-size: 24px;
    font-weight: 400;
  }
  
  &__title {
    flex: 1;
    font-size: 18px;
    font-weight: 500;
  }
  
  &__close {
    padding-left: 6px;
    padding-right: 6px;
    margin-left: 12px;
    border-radius: 50%;
    font-size: 18px;
  }
  
  &__footer {
    margin-top: 30px;
    text-align: right;
    
    .el-button {
      min-width: 100px;
      height: 36px;
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1}) {
  .echo-dialog {
    &__title-icon {
      font-size: 20px;
    }
    
    &__title {
      font-size: 16px;
    }
  }
}
</style>