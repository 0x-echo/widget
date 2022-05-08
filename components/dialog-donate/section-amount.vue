<template>
  <section
    class="section-amount">
    <h3
      class="dialog-donate__section-title">
      Choose Amount
    </h3>
    
    <div
      class="section-amount__content">
      <div
        class="section-amount__item"
        v-for="item in list"
        :key="item">
        ${{ item }}
      </div>
      
      <el-input
        class="section-amount__input"
        v-model="amount"
        size="large">
        <template 
          #prefix>
          $
        </template>
      </el-input>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElInput } from 'element-plus/dist/index.full'

const list = [1, 5, 10, 20, 50]
const amount = ref('')
</script>

<style lang="scss">
.section-amount {
  
  &__content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
  
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc((100% - 60px) / 5);
    height: 50px;
    margin-bottom: 15px;
    border: 1px solid #E2E8ED;
    border-radius: $border-radius;
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover,
    &.active {
      border-color: $primary;
      box-shadow: 0 0 4px rgba($primary, .5);
    }
  }
  
  &__input {
    width: 100%;
    height: 50px;
    
    .el-input__inner,
    .el-input__prefix-inner {
      color: $text-primary;
    }
  }
}
</style>