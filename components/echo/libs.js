export default (store) => {
  const getCommonHeader = () => {
    const token = store.token
    return {
      Authorization: `Bearer ${token}`
    }
  }
  
  return {
    getCommonHeader
  }
}