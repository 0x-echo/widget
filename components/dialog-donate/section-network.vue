<template>
  <section
    class="section-network">
    <h3
      class="dialog-donate__section-title">
      Choose Network
    </h3>
    
    <div
      class="section-network__content">
      <div
        class="section-network__content-wrapper">
        <wallet-item
          class="section-network__item"
          v-for="item in list"
          :key="item.value"
          :data="item">
        </wallet-item>
      </div>
      
      <el-button
        class="section-network__arrow-button"
        size="small">
        <i
          class="ri-arrow-right-s-line">
        </i>
      </el-button>
    </div>
  </section>
</template>

<script setup>
import { ElButton } from 'element-plus/dist/index.full'
import iconMatemask from '@/assets/metamask.svg'

const list = [{
  label: 'Ethereum',
  icon: iconMatemask,
  value: 'ethereum'
}, {
  label: 'Polygon',
  icon: iconMatemask,
  value: 'polygon'
}, {
  label: 'Binance Chain',
  icon: iconMatemask,
  value: 'binance'
}, {
  label: 'Ethereum',
  icon: iconMatemask,
  value: 'ethereum1'
}]
</script>

<style lang="scss">
.section-network {
  &__content {
    position: relative;
  }
  
  &__content-wrapper {
    display: flex;
    overflow-x: auto;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  &__item {
    flex-shrink: 0;
    width: 160px;
    margin-bottom: 0;
    
    & + & {
      margin-left: 15px;
    }
  }
  
  &__arrow-button {
    position: absolute;
    top: 27px;
    right: -12px;
    padding-left: 4px;
    padding-right: 4px;
    border-color: white; 
    font-size: 16px;
    box-shadow: 0 0 10px rgba(black, .1);
  }
}
</style>