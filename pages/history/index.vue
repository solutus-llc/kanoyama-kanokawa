<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <UButton 
              variant="ghost" 
              @click="$router.back()"
              class="mr-4"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            </UButton>
            <h1 class="text-xl font-bold text-gray-900">おすすめ履歴</h1>
          </div>
          
          <div class="text-sm text-gray-600">
            {{ recommendations.length }}件の履歴
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p class="text-gray-500 mt-4">履歴を読み込み中...</p>
      </div>
      
      <div v-else-if="recommendations.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">まだ履歴がありません</h3>
        <p class="text-gray-500 mb-4">ホームページでおすすめを生成してみましょう</p>
        <UButton @click="$router.push('/')">ホームに戻る</UButton>
      </div>
      
      <div v-else class="space-y-6">
        <!-- 統計サマリー -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            <Icon name="heroicons:chart-bar" class="w-5 h-5 inline mr-2" />
            おすすめ統計
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ totalRecommendations }}</div>
              <div class="text-sm text-gray-600">総おすすめ数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ clickedRecommendations }}</div>
              <div class="text-sm text-gray-600">クリック数</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-600">{{ clickRate }}%</div>
              <div class="text-sm text-gray-600">クリック率</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">{{ averageDays }}</div>
              <div class="text-sm text-gray-600">平均利用日数</div>
            </div>
          </div>
        </div>

        <!-- 支出分析 -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            <Icon name="heroicons:chart-pie" class="w-5 h-5 inline mr-2" />
            支出パターン分析
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">{{ spendingAnalysis.consumption }}%</div>
              <div class="text-sm text-blue-800 font-medium">消費</div>
              <div class="text-xs text-gray-600 mt-1">日用品・食材など</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <div class="text-3xl font-bold text-orange-600">{{ spendingAnalysis.waste }}%</div>
              <div class="text-sm text-orange-800 font-medium">浪費</div>
              <div class="text-xs text-gray-600 mt-1">嗜好品・娯楽など</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-3xl font-bold text-green-600">{{ spendingAnalysis.investment }}%</div>
              <div class="text-sm text-green-800 font-medium">投資</div>
              <div class="text-xs text-gray-600 mt-1">体験・スキルなど</div>
            </div>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-2">💡 支出改善アドバイス</h3>
            <p class="text-sm text-gray-600">{{ getSpendingAdvice() }}</p>
          </div>
        </div>

        <!-- 履歴一覧 -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium text-gray-900">
            <Icon name="heroicons:clock" class="w-5 h-5 inline mr-2" />
            履歴一覧
          </h2>
          
          <div 
            v-for="(recommendation, index) in recommendations" 
            :key="recommendation.id"
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="text-lg font-medium text-gray-900">
                    {{ formatDate(recommendation.date) }}
                  </div>
                  <div class="flex items-center gap-2">
                    <span 
                      v-if="recommendation.shown"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Icon name="heroicons:eye" class="w-3 h-3 mr-1" />
                      表示済み
                    </span>
                    <span 
                      v-if="recommendation.clicked"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <Icon name="heroicons:cursor-arrow-rays" class="w-3 h-3 mr-1" />
                      クリック済み
                    </span>
                  </div>
                </div>
                
                <UButton 
                  variant="outline" 
                  size="sm"
                  @click="shareRecommendation(recommendation)"
                >
                  <Icon name="heroicons:share" class="w-4 h-4 mr-1" />
                  シェア
                </UButton>
              </div>
              
              <div class="mb-4">
                <p class="text-sm text-gray-600">{{ recommendation.reason }}</p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  v-for="(product, productIndex) in getProductsForRecommendation(recommendation)" 
                  :key="product?.id || productIndex"
                  class="border rounded-lg p-4"
                >
                  <div v-if="product" class="flex gap-3">
                    <img 
                      :src="product.imageUrl" 
                      :alt="product.name"
                      class="w-16 h-16 object-cover rounded"
                      @error="handleImageError"
                    >
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <CategoryBadge :category="product.category" />
                        <SpendingTypeBadge :product="product" />
                      </div>
                      
                      <h4 class="font-medium text-sm line-clamp-2 mb-1">{{ product.name }}</h4>
                      
                      <div class="flex items-center gap-1 mb-2">
                        <Icon name="heroicons:star-solid" class="text-yellow-400 w-3 h-3" />
                        <span class="text-xs">{{ product.rating }}</span>
                        <span class="text-xs text-gray-500">({{ product.reviewCount }})</span>
                      </div>
                      
                      <div class="text-sm font-medium text-primary-600">
                        {{ formatPrice(product.price) }}円
                      </div>
                      <div class="text-xs text-red-500">
                        {{ formatPrice(product.taxBenefit) }}円還元
                      </div>
                    </div>
                  </div>
                  
                  <div v-else class="text-center text-gray-500 py-4">
                    商品が見つかりません
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

const { loadRecommendationHistory, recommendations } = useRecommendations()
const { getAllProducts, getUserActions } = useDatabase()
const { shareTargetPicker } = useLiff()

const loading = ref(false)

const totalRecommendations = computed(() => {
  return recommendations.value.reduce((total, rec) => total + rec.productIds.length, 0)
})

const clickedRecommendations = computed(() => {
  return recommendations.value.filter(rec => rec.clicked).length
})

const clickRate = computed(() => {
  const total = recommendations.value.length
  const clicked = clickedRecommendations.value
  return total > 0 ? Math.round((clicked / total) * 100) : 0
})

const averageDays = computed(() => {
  if (recommendations.value.length === 0) return 0
  
  const oldest = recommendations.value[recommendations.value.length - 1]?.date
  const newest = recommendations.value[0]?.date
  
  if (!oldest || !newest) return 0
  
  const diffTime = new Date(newest).getTime() - new Date(oldest).getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(1, diffDays)
})

const spendingAnalysis = computed(() => {
  const actions = getUserActions()
  const typeCounts = { consumption: 0, waste: 0, investment: 0 }
  
  actions.forEach(action => {
    if (action.spendingType) {
      typeCounts[action.spendingType]++
    }
  })
  
  const total = Object.values(typeCounts).reduce((sum, count) => sum + count, 0)
  
  if (total === 0) return { consumption: 33, waste: 33, investment: 34 }
  
  return {
    consumption: Math.round((typeCounts.consumption / total) * 100),
    waste: Math.round((typeCounts.waste / total) * 100),
    investment: Math.round((typeCounts.investment / total) * 100)
  }
})

const formatDate = (dateString) => {
  return format(new Date(dateString), 'yyyy年M月d日(E)', { locale: ja })
}

const formatPrice = (price) => {
  return price.toLocaleString()
}

const handleImageError = (event) => {
  const target = event.target
  target.src = '/images/placeholder-product.jpg'
}

const getProductsForRecommendation = (recommendation) => {
  const allProducts = getAllProducts()
  return recommendation.productIds.map(id => 
    allProducts.find(product => product.id === id)
  )
}

const getSpendingAdvice = () => {
  const analysis = spendingAnalysis.value
  
  if (analysis.investment > 50) {
    return '素晴らしい！投資型の購買が多く、長期的な価値を重視した賢い選択をしています。体験や高品質な商品への投資は将来的にも価値を生み出します。'
  } else if (analysis.waste > 50) {
    return '嗜好品や娯楽への支出が多めです。たまには体験型の商品や、長く使える高品質なものも検討してみると、より満足度の高い買い物ができるかもしれません。'
  } else if (analysis.consumption > 60) {
    return '実用的な商品を中心に選んでいて堅実です。時々は自分への投資として体験型の商品や、趣味に関する商品も試してみると新しい発見があるかもしれません。'
  } else {
    return 'バランスの良い支出パターンです。消費・浪費・投資のバランスが取れており、賢い選択を心がけていることが分かります。この調子で続けましょう！'
  }
}

const shareRecommendation = async (recommendation) => {
  const products = getProductsForRecommendation(recommendation)
  const message = `${formatDate(recommendation.date)}のおすすめ商品をシェア！\n\n${products.map((p, i) => p ? `${i + 1}. ${p.name} (${formatPrice(p.price)}円)` : `${i + 1}. 商品情報なし`).join('\n')}\n\n#ふるさと納税 #おすすめ`
  
  await shareTargetPicker(message)
}

// 初期データ読み込み
onMounted(async () => {
  loading.value = true
  try {
    await loadRecommendationHistory()
  } catch (error) {
    console.error('Failed to load recommendation history:', error)
  } finally {
    loading.value = false
  }
})

// SEO設定
useHead({
  title: 'おすすめ履歴 - ふるさと納税プラットフォーム',
  meta: [
    {
      name: 'description',
      content: 'あなたのふるさと納税おすすめ履歴と支出分析。過去のおすすめ商品を振り返り、支出パターンを分析して賢い選択をサポートします。'
    }
  ]
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