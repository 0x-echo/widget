<template>
  <div
    class="toolbar-item">
    <el-button
      :id="`${value}Button`"
      class="el-button--icon toolbar-item__button"
      :class="{
        'active': active
      }"
      size="large"
      :title="value"
      type="info"
      @click="$emit('on-click')">
      <i
        :class="icon">
      </i>
    </el-button>
    
    <div
      class="toolbar-item__count"
      v-if="hasCount">
      <span
        class="toolbar-item__count-number"
        ref="countRef"
        v-show="count <= 9999">
      </span>
      
      <span
        v-if="count > 9999 || displayDirectly">
        {{ $formatNumber(count) }}
      </span>
      
      <span>
        {{ showLabel && value === 'like' && count > 0 ? (count > 1 ? '&nbsp;likes' : '&nbsp;like') : '' }}
      </span>
      
    </div>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus'
import { Flip } from 'number-flip'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  count: {
    type: [Number, String]
  },
  hasCount: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String
  },
  value: {
    type: String
  }
})

const emits = defineEmits([
  'on-click'
])

const countRef = ref(null)
const displayDirectly = ref(false)

let flip

onMounted(() => {
  if (!countRef.value) {
    return
  }
  flip = new Flip({
    node: countRef.value,
    from: props.count,
    systemArr: [(props.count < 10 && props.count < 10) ? '&nbsp;' : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  })
})

watch(() => props.count, (val, oldVal) => {
  console.log('value change', val, oldVal)
  const oldLength = oldVal.toString().length
  const newLength = val.toString().length
  console.log(oldLength, newLength)

  // drop from 4 digits to 2 digits
  if (Math.abs(newLength - oldLength) >= 2) {
    displayDirectly.value = true
    countRef.value.innerHTML = ''
    flip = null
    return
  } else {
    displayDirectly.value = false
  }

  let from = oldVal
  if (newLength > oldLength) {
    // const offset = newLength - oldLength
    // for (let i = 0; i < offset; i++) {
    //   from = '0' + from
    // }
    countRef.value.innerHTML = ''
    flip = new Flip({
      node: countRef.value,
      from,
      to: val,
      systemArr: [(props.count < 10 && props.count < 10) ? '&nbsp;' : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
    })
  }

  if (oldVal <= 9999) {
    if (!flip) {
        flip = new Flip({
        node: countRef.value,
        from: props.count,
        systemArr: [(props.count < 10 && props.count < 10) ? '&nbsp;' : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
      })
    }
    console.log('go flip')
    try {
      flip.flipTo({
        from,
        // direct: true,
        to: val || ' '
      }) 
    } catch (e) {
      console.log(e)
    }
  }
})
</script>

<style lang="scss">
// liking bubble credit https://codepen.io/ren_estep/pen/gOpdVOV
.toolbar-item {
  display: flex;
  align-items: center;
  
  & + & {
    margin-left: 10px;
  }
  
  &__button {
    width: 40px;
    height: 40px;
  }
  
  [id="likeButton"] {
    position: relative;

    &:before,
    &:after {
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      content: "";
    }

    &:before {
      box-sizing: border-box;
      border: solid 2.25rem #e2264d;
      margin: -2.25rem;
      width: 4.5rem;
      height: 4.5rem;
      transform: scale(0);
    }

    &:after {
      box-shadow: 0.32476rem -3rem 0 -0.1875rem #ff8080, -0.32476rem -2.625rem 0 -0.1875rem #ffed80, 2.54798rem -1.61656rem 0 -0.1875rem #ffed80, 1.84982rem -1.89057rem 0 -0.1875rem #a4ff80, 2.85252rem 0.98418rem 0 -0.1875rem #a4ff80, 2.63145rem 0.2675rem 0 -0.1875rem #80ffc8, 1.00905rem 2.84381rem 0 -0.1875rem #80ffc8, 1.43154rem 2.22414rem 0 -0.1875rem #80c8ff, -1.59425rem 2.562rem 0 -0.1875rem #80c8ff, -0.84635rem 2.50595rem 0 -0.1875rem #a480ff, -2.99705rem 0.35095rem 0 -0.1875rem #a480ff, -2.48692rem 0.90073rem 0 -0.1875rem #ff80ed, -2.14301rem -2.12438rem 0 -0.1875rem #ff80ed, -2.25479rem -1.38275rem 0 -0.1875rem #ff8080;
      margin: -0.1875rem;
      width: 0.375rem;
      height: 0.375rem;
    } 
  
    &.active {
      will-change: font-size;
      animation: heartBeat 1s cubic-bezier(0.17, 0.89, 0.32, 1.49);
      
      &::before,
      &::after {
        animation: inherit;
        animation-timing-function: ease-out;
      }
      &:before {
        will-change: transform, border-color, border-width;
        animation-name: mainExplosion;
      }
      &:after {
        will-change: opacity, box-shadow;
        animation-name: particles;
      }
    } 
  }
  
  &__count {
    display: flex;
    min-width: 40px;
    margin-left: 8px;
    font-size: 14px;
    color: var(--text-color-primary);
  }
}

@keyframes heartBeat {
  0%,
  17.5% {
    font-size: 0;
  }
}

@keyframes mainExplosion {
  15% {
    transform: scale(1);
    border-color: var(--color-primary);
    border-width: 2.25rem;
  }
  30%,
  100% {
    transform: scale(1);
    border-color: var(--color-primary);
    border-width: 0;
  }
}

@keyframes particles {
  0%,
  20% {
    opacity: 0;
  }
  25% {
    opacity: 1;
    box-shadow: 0.32476rem -2.4375rem 0 0rem #ff8080, -0.32476rem -2.0625rem 0 0rem #ffed80, 2.1082rem -1.26585rem 0 0rem #ffed80, 1.41004rem -1.53985rem 0 0rem #a4ff80, 2.30412rem 0.85901rem 0 0rem #a4ff80, 2.08305rem 0.14233rem 0 0rem #80ffc8, 0.76499rem 2.33702rem 0 0rem #80ffc8, 1.18748rem 1.71734rem 0 0rem #80c8ff, -1.35019rem 2.0552rem 0 0rem #80c8ff, -0.60229rem 1.99916rem 0 0rem #a480ff, -2.44865rem 0.22578rem 0 0rem #a480ff, -1.93852rem 0.77557rem 0 0rem #ff80ed, -1.70323rem -1.77366rem 0 0rem #ff80ed, -1.81501rem -1.03204rem 0 0rem #ff8080;
  }
}
</style>