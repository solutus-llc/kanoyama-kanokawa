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
            <h1 class="text-xl font-bold text-gray-900">商品検索</h1>
          </div>
          
          <div class="text-sm text-gray-600">
            {{ filteredProducts.length }}件の商品
          </div>
        </div>
      </div>
    </header>

    <!-- 検索・フィルターセクション -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="space-y-4">
          <!-- 検索バー -->
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="商品名、地域、キーワードで検索..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
          </div>
          
          <!-- カテゴリフィルター -->
          <div class="flex flex-wrap gap-2">
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
          
          <!-- 価格帯フィルター -->
          <div class="flex items-center gap-4">
            <span class="text-sm font-medium text-gray-700">価格帯:</span>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="priceRange in priceRanges"
                :key="priceRange.value"
                :variant="selectedPriceRange === priceRange.value ? 'solid' : 'outline'"
                size="sm"
                @click="selectedPriceRange = priceRange.value"
              >
                {{ priceRange.label }}
              </UButton>
            </div>
          </div>
          
          <!-- ソート -->
          <div class="flex items-center gap-4">
            <span class="text-sm font-medium text-gray-700">並び順:</span>
            <select 
              v-model="sortBy"
              class="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="rating">評価順</option>
              <option value="price-low">価格順（安い順）</option>
              <option value="price-high">価格順（高い順）</option>
              <option value="tax-benefit">還元額順</option>
              <option value="review-count">レビュー数順</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品一覧 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p class="text-gray-500 mt-4">商品を読み込み中...</p>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">商品が見つかりませんでした</h3>
        <p class="text-gray-500 mb-4">検索条件を変更してお試しください</p>
        <UButton @click="clearFilters">フィルターをクリア</UButton>
      </div>
      
      <div v-else>
        <!-- 結果サマリー -->
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-800">
                <span class="font-medium">{{ filteredProducts.length }}件</span>の商品が見つかりました
                <span v-if="searchQuery" class="ml-2">
                  「<span class="font-medium">{{ searchQuery }}</span>」の検索結果
                </span>
              </p>
            </div>
            <UButton 
              v-if="hasActiveFilters" 
              variant="outline" 
              size="sm"
              @click="clearFilters"
            >
              フィルターをクリア
            </UButton>
          </div>
        </div>
        
        <!-- 商品グリッド -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
        
        <!-- ページネーション -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <div class="flex items-center gap-2">
            <UButton 
              :disabled="currentPage === 1"
              variant="outline"
              @click="currentPage--"
            >
              前へ
            </UButton>
            
            <div class="flex items-center gap-1">
              <span 
                v-for="page in visiblePages" 
                :key="page"
                class="px-3 py-1 text-sm"
                :class="page === currentPage ? 'bg-primary-500 text-white rounded' : 'text-gray-600'"
                @click="currentPage = page"
                style="cursor: pointer"
              >
                {{ page }}
              </span>
            </div>
            
            <UButton 
              :disabled="currentPage === totalPages"
              variant="outline"
              @click="currentPage++"
            >
              次へ
            </UButton>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const { loadProducts, products, searchProducts, filterByCategory } = useProducts()

const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedPriceRange = ref('all')
const sortBy = ref('rating')
const currentPage = ref(1)
const itemsPerPage = 12

const categories = [
  { value: 'all', label: 'すべて', icon: 'heroicons:squares-2x2' },
  { value: 'meat', label: '肉類', icon: 'heroicons:fire' },
  { value: 'seafood', label: '海鮮', icon: 'heroicons:water' },
  { value: 'rice', label: 'お米', icon: 'heroicons:bowl-rice' },
  { value: 'fruit', label: 'フルーツ', icon: 'heroicons:apple' },
  { value: 'vegetable', label: '野菜', icon: 'heroicons:leaf' },
  { value: 'sweets', label: 'お菓子', icon: 'heroicons:cake' },
  { value: 'drink', label: '飲み物', icon: 'heroicons:glass-water' },
  { value: 'craft', label: '工芸品', icon: 'heroicons:gift' },
  { value: 'experience', label: '体験', icon: 'heroicons:ticket' },
  { value: 'other', label: 'その他', icon: 'heroicons:ellipsis-horizontal' }
]

const priceRanges = [
  { value: 'all', label: 'すべて' },
  { value: '0-5000', label: '5,000円以下' },
  { value: '5000-10000', label: '5,000円-10,000円' },
  { value: '10000-20000', label: '10,000円-20,000円' },
  { value: '20000-50000', label: '20,000円-50,000円' },
  { value: '50000+', label: '50,000円以上' }
]

const filteredProducts = computed(() => {
  let result = products.value

  // テキスト検索
  if (searchQuery.value) {
    result = searchProducts(searchQuery.value)
  }

  // カテゴリフィルター
  if (selectedCategory.value !== 'all') {
    result = result.filter(product => product.category === selectedCategory.value)
  }

  // 価格フィルター
  if (selectedPriceRange.value !== 'all') {
    const [min, max] = selectedPriceRange.value.split('-').map(Number)
    result = result.filter(product => {
      if (selectedPriceRange.value === '50000+') {
        return product.price >= 50000
      }
      return product.price >= min && product.price <= max
    })
  }

  // ソート
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'rating':
        return (b.rating * b.reviewCount) - (a.rating * a.reviewCount)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'tax-benefit':
        return b.taxBenefit - a.taxBenefit
      case 'review-count':
        return b.reviewCount - a.reviewCount
      default:
        return 0
    }
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedCategory.value !== 'all' || 
         selectedPriceRange.value !== 'all' ||
         sortBy.value !== 'rating'
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedPriceRange.value = 'all'
  sortBy.value = 'rating'
  currentPage.value = 1
}

// 検索クエリが変更されたらページをリセット
watch([searchQuery, selectedCategory, selectedPriceRange], () => {
  currentPage.value = 1
})

// 初期データ読み込み
onMounted(async () => {
  loading.value = true
  try {
    await loadProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
})

// SEO設定
useHead({
  title: '商品検索 - ふるさと納税プラットフォーム',
  meta: [
    {
      name: 'description',
      content: 'ふるさと納税の返礼品を検索・比較。20以上のサービスから厳選された商品をカテゴリや価格帯で絞り込んで探せます。'
    }
  ]
})
</script>