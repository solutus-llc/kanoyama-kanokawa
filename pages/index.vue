<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">🏠 ふるさと納税</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <UButton 
              v-if="isLoggedIn" 
              variant="ghost" 
              size="sm"
              @click="navigateToHistory"
            >
              <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
              履歴
            </UButton>
            
            <UButton 
              v-if="isLoggedIn" 
              variant="ghost" 
              size="sm"
              @click="navigateToProducts"
            >
              <Icon name="heroicons:magnifying-glass" class="w-4 h-4 mr-1" />
              商品検索
            </UButton>
            
            <div v-if="isLoggedIn && userProfile" class="flex items-center gap-2">
              <img 
                v-if="userProfile.pictureUrl" 
                :src="userProfile.pictureUrl" 
                :alt="userProfile.displayName"
                class="w-8 h-8 rounded-full"
              >
              <span class="text-sm text-gray-600">{{ userProfile.displayName }}</span>
            </div>
            
            <UButton 
              v-else 
              color="primary" 
              size="sm"
              @click="login"
            >
              ログイン
            </UButton>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- ウェルカムセクション -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          ふるさと納税をもっと楽しく、もっと賢く
        </h2>
        <p class="text-lg text-gray-600 mb-6">
          20以上のサービスから厳選された商品をAIがあなたにおすすめします
        </p>
        
        <!-- 統計カード -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-2xl font-bold text-primary-600">20+</div>
            <div class="text-sm text-gray-600">連携サービス</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-2xl font-bold text-green-600">{{ totalProducts }}</div>
            <div class="text-sm text-gray-600">掲載商品数</div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-2xl font-bold text-blue-600">毎日3選</div>
            <div class="text-sm text-gray-600">パーソナライズ</div>
          </div>
        </div>
      </div>

      <!-- 今日のおすすめ -->
      <div class="mb-12">
        <RecommendationList />
      </div>

      <!-- カテゴリ別人気商品 -->
      <div class="mb-12">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">カテゴリ別人気商品</h3>
        
        <div class="flex flex-wrap gap-2 mb-6">
          <UButton
            v-for="category in categories"
            :key="category.value"
            :variant="selectedCategory === category.value ? 'solid' : 'outline'"
            size="sm"
            @click="selectedCategory = category.value"
          >
            <Icon :name="category.icon" class="w-4 h-4 mr-1" />
            {{ category.label }}
          </UButton>
        </div>
        
        <div v-if="loadingProducts">
          <ProductsLoadingState :product-count="totalProducts" :is-initializing="true" />
        </div>
        
        <div v-else-if="displayProducts.length === 0">
          <ProductsLoadingState :product-count="totalProducts" />
        </div>
        
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard 
              v-for="product in displayProducts" 
              :key="product.id" 
              :product="product" 
            />
          </div>
          
          <div class="text-center mt-8">
            <UButton 
              variant="outline" 
              @click="navigateToProducts"
            >
              すべての商品を見る
            </UButton>
          </div>
        </div>
      </div>

      <!-- 支出分析セクション -->
      <div v-if="isLoggedIn" class="mb-12">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            <Icon name="heroicons:chart-pie" class="w-5 h-5 inline mr-2" />
            あなたの支出分析
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ spendingAnalysis.consumption }}%</div>
              <div class="text-sm text-gray-600">消費（日用品・食材）</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">{{ spendingAnalysis.waste }}%</div>
              <div class="text-sm text-gray-600">浪費（嗜好品・娯楽）</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ spendingAnalysis.investment }}%</div>
              <div class="text-sm text-gray-600">投資（体験・スキル）</div>
            </div>
          </div>
          
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">
              💡 <strong>アドバイス:</strong> {{ getSpendingAdvice() }}
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- フッター -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-500 text-sm">
          <p>© 2024 ふるさと納税プラットフォーム</p>
          <p class="mt-2">20以上のふるさと納税サービスと連携しています</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { isLoggedIn, userProfile, login } = useLiff()
const { loadProducts, refreshProducts, products, filterByCategory, getPopularProducts } = useProducts()
const { getUserActions } = useDatabase()

const loadingProducts = ref(false)
const selectedCategory = ref('all')
const totalProducts = ref(0)

const categories = [
  { value: 'all', label: 'すべて', icon: 'heroicons:squares-2x2' },
  { value: 'meat', label: '肉類', icon: 'heroicons:fire' },
  { value: 'seafood', label: '海鮮', icon: 'heroicons:water' },
  { value: 'fruit', label: 'フルーツ', icon: 'heroicons:apple' },
  { value: 'rice', label: 'お米', icon: 'heroicons:bowl-rice' },
  { value: 'sweets', label: 'お菓子', icon: 'heroicons:cake' },
  { value: 'experience', label: '体験', icon: 'heroicons:ticket' }
]

const displayProducts = computed(() => {
  const filtered = selectedCategory.value === 'all' 
    ? getPopularProducts(8)
    : filterByCategory(selectedCategory.value).slice(0, 8)
  return filtered
})

const spendingAnalysis = computed(() => {
  if (!isLoggedIn.value) return { consumption: 0, waste: 0, investment: 0 }
  
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

const getSpendingAdvice = () => {
  const analysis = spendingAnalysis.value
  
  if (analysis.investment > 50) {
    return '素晴らしい！投資型の購買が多く、長期的な価値を重視しています。'
  } else if (analysis.waste > 50) {
    return '嗜好品への支出が多めです。時々は投資型の商品も検討してみましょう。'
  } else {
    return 'バランスの良い支出パターンです。引き続き賢い選択を心がけましょう。'
  }
}

const navigateToProducts = () => {
  navigateTo('/products')
}

const navigateToHistory = () => {
  navigateTo('/history')
}

// 初期データ読み込み
onMounted(async () => {
  loadingProducts.value = true
  try {
    await loadProducts()
    totalProducts.value = products.value.length
    
    // 実際のスクレイピングを開始
    const { initializeAutoScraping } = useRealProductScraper()
    initializeAutoScraping()
    
    // 30秒ごとに商品リストを更新
    setInterval(() => {
      const newCount = refreshProducts()
      if (newCount !== totalProducts.value) {
        totalProducts.value = newCount
        console.log(`商品数が更新されました: ${totalProducts.value}件`)
      }
    }, 30000)
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loadingProducts.value = false
  }
})

// SEO設定
useHead({
  title: 'ふるさと納税プラットフォーム - もっと楽しく、もっと賢く',
  meta: [
    {
      name: 'description',
      content: '20以上のふるさと納税サービスから厳選された商品をAIがパーソナライズしてお届け。毎日3選のおすすめで、あなたにぴったりの返礼品を見つけよう。'
    }
  ]
})
</script>