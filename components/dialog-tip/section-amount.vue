<template>
  <section
    class="section-amount">
    <h3
      class="dialog-tip__section-title">
      Choose Amount
    </h3>
    
    <div
      class="section-amount__content">
      <div
        class="section-amount__item"
        :class="{
          'active': item === activeOption
        }"
        v-for="item in list"
        :key="item"
        @click="changeOption(item)">
        ${{ item }}
      </div>
      
      <el-input
        class="section-amount__input"
        :class="{
          'active': amount
        }"
        v-model="amount"
        size="large"
        @input="onChangeInput">
        <template 
          #prefix>
          $
        </template>
      </el-input>
    </div>
  </section>
</template>

<script setup>
import { ElInput } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: [String, Number]
  }
})

const emits = defineEmits([
  'update:modelValue'
])

const activeOption = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})

const changeOption = (item) => {
  activeOption.value = item
  amount.value = ''
}

const list = [1, 5, 10, 20, 50]
const amount = ref('')

const onChangeInput = (value) => {
  console.log(value)
  if (value) {
    activeOption.value = value
  }
}
</script>

<style lang="scss">
.section-amount {
  &__content {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc((100% - 60px) / 5);
    height: 50px;
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--fill-color-blank);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover,
    &.active {
      border-color: var(--color-primary);
      box-shadow: 0 0 4px rgba(var(--color-primary-rgb), .5);
    }
  }
  
  &__input {
    width: 100%;
    height: 50px;
    
    &.active {
      .el-input__wrapper {
        box-shadow: inset 0 0 0 1px var(--color-primary);
      }
    }
    
    .el-input__inner,
    .el-input__prefix-inner {
      color: var(--text-color-primary);
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .section-amount {
    &__item {
      width: calc((100% - 30px) / 4);
    }
    
    &__input {
      flex: 1;
      margin-left: 10px;
    }
  }
}
</style>