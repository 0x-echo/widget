<template>
  <el-popover
    :offset="2"
    placement="bottom-end"
    ref="sortPopover"
    trigger="click"
    :width="165">
    <template 
      #reference>
      <div
        class="echo-sort">
        <span
          class="echo-sort__label">
          {{ sortOptions.filter(item => {return item.value === currentSort })[0].label }}
        </span>
        
        <i
          class="ri-arrow-down-s-line">
        </i>
      </div>
    </template>
    
    <div
      class="echo-sort__list">
      <menu-item
        v-for="item in sortOptions"
        :key="item.value"
        :label="item.label"
        :selected="item.value === currentSort"
        @on-click="onClickSortOption(item.value)">
      </menu-item>
    </div>
  </el-popover>
</template>

<script setup>
import { ElPopover } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String
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

const sortOptions = [{
  value: 'newest',
  label: 'Newest'
}, {
  value: 'best',
  label: 'Recommended'
}]

const sortPopover = ref(null)
const onClickSortOption = (value) => {
  currentSort.value = value
  sortPopover.value.hide()
}
</script>

<style lang="scss">
.echo-sort {
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
    .menu-item:not(.is-selected) {
      &:hover {
        background: none;
      }
    }
  }
}
</style>