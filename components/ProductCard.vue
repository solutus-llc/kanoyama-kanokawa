<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="relative">
      <img 
        :src="product.imageUrl" 
        :alt="product.name"
        class="w-full h-48 object-cover"
        @error="handleImageError"
      >
      <div class="absolute top-2 right-2">
        <span class="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
          {{ formatPrice(product.taxBenefit) }}円還元
        </span>
      </div>
    </div>
    
    <div class="p-4">
      <div class="flex items-center gap-2 mb-2">
        <CategoryBadge :category="product.category" />
        <span class="text-sm text-gray-500">{{ product.region }}</span>
      </div>
      
      <h3 class="font-medium text-lg mb-2 line-clamp-2">{{ product.name }}</h3>
      
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
      
      <div class="flex items-center gap-2 mb-3">
        <div class="flex items-center gap-1">
          <Icon name="heroicons:star-solid" class="text-yellow-400 w-4 h-4" />
          <span class="text-sm font-medium">{{ product.rating }}</span>
        </div>
        <span class="text-gray-400">·</span>
        <span class="text-sm text-gray-500">{{ product.reviewCount }}件</span>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <div class="text-lg font-bold text-gray-900">
            {{ formatPrice(product.price) }}円
          </div>
          <div class="text-sm text-gray-500 line-through">
            {{ formatPrice(product.originalPrice) }}円
          </div>
        </div>
        
        <UButton 
          color="primary" 
          size="sm"
          @click="viewProduct"
        >
          詳細を見る
        </UButton>
      </div>
      
      <div class="mt-3 flex items-center gap-2">
        <Icon name="heroicons:building-storefront" class="w-4 h-4 text-gray-400" />
        <span class="text-sm text-gray-500">{{ product.service.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['product'])
const { addUserAction } = useDatabase()
const { openExternalWindow } = useLiff()

const formatPrice = (price) => {
  return price.toLocaleString()
}

const handleImageError = (event) => {
  const target = event.target
  target.src = '/images/placeholder-product.jpg'
}

const viewProduct = () => {
  // ユーザーアクションを記録
  addUserAction({
    id: `action-${Date.now()}`,
    productId: props.product.id,
    actionType: 'view',
    timestamp: new Date()
  })
  
  // 外部サイトで商品詳細を開く
  openExternalWindow(`${props.product.service.url}?product=${props.product.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>