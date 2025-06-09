<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtPage />
  </div>
</template>

<script setup>
const { initLiff } = useLiff()
const { initDatabase } = useDatabase()

// アプリ初期化
onMounted(async () => {
  await initDatabase()
  await initLiff()
})

// ヘッド設定
useHead({
  title: 'ふるさと納税プラットフォーム',
  meta: [
    { name: 'description', content: 'ふるさと納税をもっと楽しく、もっと賢く' }
  ]
})
</script>