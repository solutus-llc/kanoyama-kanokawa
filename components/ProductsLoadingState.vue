<template>
  <div class="text-center py-12">
    <div v-if="isInitializing" class="space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      <h3 class="text-lg font-medium text-gray-900">データベースを初期化中...</h3>
      <p class="text-gray-600">初回アクセス時は少しお時間をいただきます</p>
    </div>
    
    <div v-else-if="productCount === 0" class="space-y-4">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900">商品データを収集中</h3>
      <p class="text-gray-600 mb-4">
        実際のふるさと納税サイトから商品情報を収集しています<br>
        1分間に最大10件のペースで自動収集中です
      </p>
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
        <div class="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
        <span class="text-sm text-blue-700">バックグラウンドで収集中...</span>
      </div>
    </div>
    
    <div v-else-if="productCount < 20" class="space-y-4">
      <div class="text-4xl mb-4">📦</div>
      <h3 class="text-lg font-medium text-gray-900">商品データを追加収集中</h3>
      <p class="text-gray-600">
        現在 {{ productCount }} 件の商品があります<br>
        より多くの商品を収集中です
      </p>
      <UButton @click="refreshProducts" variant="outline">
        <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-1" />
        更新
      </UButton>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['productCount', 'isInitializing'])

const refreshProducts = () => {
  window.location.reload()
}
</script>