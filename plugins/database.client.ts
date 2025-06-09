export default defineNuxtPlugin(async () => {
  const { initDatabase } = useDatabase()
  
  // クライアントサイドでのみ実行
  if (process.client) {
    await initDatabase()
  }
})