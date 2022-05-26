import { ElMessage } from 'element-plus'

export default () => {
  const showLoading = () => {
    return ElMessage({
      customClass: 'el-message--no-icon',
      message: h('div', { class: 'chat-loader', style: 'width: 20px; height: 20px;border-color:#4E75F6;'}, ''),
      duration: 0
    })
  }

  return {
    showLoading
  }
}
