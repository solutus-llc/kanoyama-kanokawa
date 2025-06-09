export default defineNuxtPlugin(async () => {
  const { initLiff } = useLiff()
  
  // クライアントサイドでのみ実行
  if (process.client) {
    await initLiff()
  }
})