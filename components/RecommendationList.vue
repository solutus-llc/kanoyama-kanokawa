<template>
  <div class="space-y-4">
    <div class="text-center py-8">
      <div class="text-2xl mb-2">🎯</div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">今日のあなたへのおすすめ</h2>
      <p class="text-gray-600 text-sm">{{ recommendationReason }}</p>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      <p class="text-gray-500 mt-2">おすすめを生成中...</p>
    </div>
    
    <div v-else-if="recommendations.length === 0" class="text-center py-8">
      <div class="text-4xl mb-4">🤔</div>
      <p class="text-gray-500">まだおすすめがありません</p>
      <UButton @click="generateRecommendations" class="mt-4">
        おすすめを生成する
      </UButton>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="(product, index) in recommendations" 
        :key="product.id"
        class="relative"
      >
        <div class="absolute -left-2 -top-2 z-10">
          <div class="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {{ index + 1 }}
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden border-2 border-primary-100">
          <div class="p-4">
            <div class="flex gap-4">
              <img 
                :src="product.imageUrl" 
                :alt="product.name"
                class="w-20 h-20 object-cover rounded-lg"
                @error="handleImageError"
              >
              
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <CategoryBadge :category="product.category" />
                  <SpendingTypeBadge :product="product" />
                </div>
                
                <h3 class="font-medium text-lg mb-1 line-clamp-2">{{ product.name }}</h3>
                
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:star-solid" class="text-yellow-400 w-4 h-4" />
                    <span class="text-sm font-medium">{{ product.rating }}</span>
                  </div>
                  <span class="text-gray-400">·</span>
                  <span class="text-sm text-gray-500">{{ product.reviewCount }}件</span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-lg font-bold text-primary-600">
                      {{ formatPrice(product.price) }}円
                    </div>
                    <div class="text-sm text-red-500">
                      {{ formatPrice(product.taxBenefit) }}円還元
                    </div>
                  </div>
                  
                  <UButton 
                    color="primary" 
                    size="sm"
                    @click="viewProduct(product)"
                  >
                    詳細を見る
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center pt-4">
        <UButton 
          variant="outline" 
          @click="shareRecommendations"
          class="mr-2"
        >
          <Icon name="heroicons:share" class="w-4 h-4 mr-1" />
          シェア
        </UButton>
        
        <UButton 
          variant="outline" 
          @click="generateRecommendations"
        >
          <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-1" />
          再生成
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const { loadTodaysRecommendations, todaysRecommendations, markRecommendationAsShown } = useRecommendations()
const { shareTargetPicker } = useLiff()
const { addUserAction } = useDatabase()

const loading = ref(false)
const recommendationReason = ref('あなたの過去の閲覧履歴から厳選しました')

const recommendations = computed(() => todaysRecommendations.value)

const formatPrice = (price) => {
  return price.toLocaleString()
}

const handleImageError = (event) => {
  const target = event.target
  target.src = '/images/placeholder-product.jpg'
}

const generateRecommendations = async () => {
  loading.value = true
  try {
    await loadTodaysRecommendations()
    
    // 表示したことを記録
    const today = new Date().toISOString().split('T')[0]
    markRecommendationAsShown(`rec-${today}`)
  } catch (error) {
    console.error('Failed to generate recommendations:', error)
  } finally {
    loading.value = false
  }
}

const viewProduct = (product) => {
  // ユーザーアクションを記録
  addUserAction({
    id: `action-${Date.now()}`,
    productId: product.id,
    actionType: 'click',
    timestamp: new Date()
  })
  
  // 推薦クリックを記録
  const today = new Date().toISOString().split('T')[0]
  markRecommendationAsClicked(`rec-${today}`)
  
  // 商品詳細を表示（実際のサービスサイトに遷移）
  const { openExternalWindow } = useLiff()
  openExternalWindow(`${product.service.url}?product=${product.id}`)
}

const shareRecommendations = async () => {
  const message = `今日のふるさと納税おすすめ3選をチェック！\n\n${recommendations.value.map((p, i) => `${i + 1}. ${p.name} (${formatPrice(p.price)}円)`).join('\n')}\n\n#ふるさと納税 #おすすめ`
  
  await shareTargetPicker(message)
}

// 初期ロード
onMounted(() => {
  generateRecommendations()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>