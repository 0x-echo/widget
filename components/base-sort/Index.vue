<template>
  <el-popover
    :offset="2"
    placement="bottom-end"
    ref="sortPopover"
    :teleported="false"
    trigger="click"
    :width="165">
    <template 
      #reference>
      <div
        class="base-sort">
        <span
          class="base-sort__label">
          {{ options.filter(item => {return item.value === currentSort })[0].label }}
        </span>
        
        <i
          class="ri-arrow-down-s-line">
        </i>
      </div>
    </template>
    
    <div
      class="base-sort__list">
      <base-menu-item
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :selected="item.value === currentSort"
        @on-click="onClickSortOption(item.value)">
      </base-menu-item>
    </div>
  </el-popover>
</template>

<script setup>
import { ElPopover } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String
  },
  options: {
    type: Array,
    default () {
      return [{
        value: 'newest',
        label: 'Newest'
      }, {
        value: 'best',
        label: 'Recommended'
      }]
    }
  }
})

const emits = defineEmits([
  'update:modelValue'
])

let currentSort = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})

const sortPopover = ref(null)
const onClickSortOption = (value) => {
  currentSort.value = value
  sortPopover.value.hide()
}
</script>

<style lang="scss">
.base-sort {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  height: 32px;
  font-size: 12px;
  color: var(--echo-text-color-secondary);
  cursor: pointer;
  
  &__label {
    margin-right: 6px;
  }
  
  &__list {
    .base-menu-item:not(.is-selected) {
      &:hover {
        background: none;
      }
    }
  }
}
</style>