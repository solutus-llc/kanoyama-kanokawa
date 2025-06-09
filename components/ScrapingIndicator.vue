<template>
  <div v-if="isScrapingActive" class="fixed top-4 right-4 z-50">
    <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">商品データ収集中</div>
          <div class="text-xs text-gray-500">{{ scrapingProgress.site }}</div>
        </div>
        <UButton 
          variant="ghost" 
          size="sm" 
          icon="heroicons:x-mark"
          @click="stopScraping"
        />
      </div>
      
      <div class="mt-3">
        <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>進行状況</span>
          <span>{{ scrapingProgress.current }}/{{ scrapingProgress.total }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-primary-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>
      
      <div class="mt-2 text-xs text-gray-500">
        ⚡ 1分間に最大10件のペースで収集中
      </div>
    </div>
  </div>
</template>

<script setup>
const { isScrapingActive, scrapingProgress, stopScraping } = useRealProductScraper()

const progressPercentage = computed(() => {
  if (scrapingProgress.value.total === 0) return 0
  return Math.round((scrapingProgress.value.current / scrapingProgress.value.total) * 100)
})
</script>