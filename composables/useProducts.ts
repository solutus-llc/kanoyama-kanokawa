import type { FurusatoProduct, FurusatoService } from '~/types'

export const generateMockProducts = async (): Promise<FurusatoProduct[]> => {
  const services: FurusatoService[] = [
    { id: 'furunavi', name: 'ふるなび', url: 'https://furunavi.jp', logoUrl: '' },
    { id: 'satofull', name: 'さとふる', url: 'https://satofull.jp', logoUrl: '' },
    { id: 'rakuten', name: '楽天ふるさと納税', url: 'https://event.rakuten.co.jp/furusato/', logoUrl: '' },
    { id: 'furusato-tax', name: 'ふるさとチョイス', url: 'https://furusato-tax.jp', logoUrl: '' },
    { id: 'au-pay', name: 'au PAY ふるさと納税', url: 'https://furusato.au.com', logoUrl: '' },
    { id: 'ana', name: 'ANAのふるさと納税', url: 'https://furusato.ana.co.jp', logoUrl: '' },
    { id: 'jal', name: 'JALふるさと納税', url: 'https://furusato.jal.co.jp', logoUrl: '' },
    { id: 'yahoo', name: 'Yahoo!ふるさと納税', url: 'https://furusato.yahoo.co.jp', logoUrl: '' }
  ]

  const products: Partial<FurusatoProduct>[] = [
    {
      name: '北海道産 特選和牛セット',
      price: 15000,
      category: 'meat',
      region: '北海道',
      description: '北海道の豊かな自然で育てられた黒毛和牛の厳選部位をセットにしました。',
      tags: ['高級', '和牛', '北海道']
    },
    {
      name: '新潟県産コシヒカリ 10kg',
      price: 12000,
      category: 'rice',
      region: '新潟県',
      description: '新潟の清らかな水と肥沃な土壌で育った最高級コシヒカリです。',
      tags: ['米', 'コシヒカリ', '新潟']
    },
    {
      name: '青森県産りんご 5kg',
      price: 8000,
      category: 'fruit',
      region: '青森県',
      description: '青森の寒暖差が生み出す甘くて美味しいりんごの詰め合わせです。',
      tags: ['りんご', '青森', 'フルーツ']
    },
    {
      name: '静岡県産 高級茶葉セット',
      price: 10000,
      category: 'drink',
      region: '静岡県',
      description: '静岡の老舗茶園で丁寧に育てられた上質な茶葉のセットです。',
      tags: ['お茶', '静岡', '高級']
    },
    {
      name: '鹿児島県産 本格焼酎セット',
      price: 18000,
      category: 'drink',
      region: '鹿児島県',
      description: '鹿児島の蔵元が誇る本格焼酎の飲み比べセットです。',
      tags: ['焼酎', '鹿児島', 'お酒']
    },
    {
      name: '山形県産 さくらんぼ 1kg',
      price: 14000,
      category: 'fruit',
      region: '山形県',
      description: '山形が誇る甘くて美味しいさくらんぼの最高級品です。',
      tags: ['さくらんぼ', '山形', '高級フルーツ']
    },
    {
      name: '北海道産 海鮮セット',
      price: 20000,
      category: 'seafood',
      region: '北海道',
      description: '北海道の新鮮な海の幸を詰め合わせた豪華セットです。',
      tags: ['海鮮', '北海道', '新鮮']
    },
    {
      name: '京都府産 老舗の和菓子セット',
      price: 12000,
      category: 'sweets',
      region: '京都府',
      description: '京都の老舗和菓子店が作る伝統の味をお楽しみください。',
      tags: ['和菓子', '京都', '老舗']
    },
    {
      name: '沖縄県産 マンゴー 2kg',
      price: 16000,
      category: 'fruit',
      region: '沖縄県',
      description: '沖縄の太陽をたっぷり浴びた完熟マンゴーです。',
      tags: ['マンゴー', '沖縄', 'トロピカル']
    },
    {
      name: '長野県産 高原野菜セット',
      price: 9000,
      category: 'vegetable',
      region: '長野県',
      description: '長野の高原で育った新鮮で美味しい野菜の詰め合わせです。',
      tags: ['野菜', '長野', '高原']
    },
    {
      name: '熊本県産 馬刺しセット',
      price: 22000,
      category: 'meat',
      region: '熊本県',
      description: '熊本名物の新鮮な馬刺しを特製タレとともにお届けします。',
      tags: ['馬刺し', '熊本', '特産品']
    },
    {
      name: '石川県産 加賀野菜詰め合わせ',
      price: 11000,
      category: 'vegetable',
      region: '石川県',
      description: '加賀地方の伝統野菜を厳選した季節の詰め合わせです。',
      tags: ['加賀野菜', '石川', '伝統']
    },
    {
      name: '愛媛県産 みかん 5kg',
      price: 7000,
      category: 'fruit',
      region: '愛媛県',
      description: '愛媛の温暖な気候で育った甘いみかんをお届けします。',
      tags: ['みかん', '愛媛', '柑橘']
    },
    {
      name: '大分県産 温泉水 24本セット',
      price: 8000,
      category: 'drink',
      region: '大分県',
      description: '大分の名湯から汲み上げた天然温泉水のセットです。',
      tags: ['温泉水', '大分', '天然水']
    },
    {
      name: '福岡県産 明太子 500g',
      price: 13000,
      category: 'seafood',
      region: '福岡県',
      description: '福岡名物の辛子明太子を職人が丁寧に仕上げました。',
      tags: ['明太子', '福岡', '名物']
    },
    {
      name: '兵庫県産 神戸牛ステーキ',
      price: 35000,
      category: 'meat',
      region: '兵庫県',
      description: '世界に誇る神戸牛の最高級ステーキ肉です。',
      tags: ['神戸牛', '兵庫', '最高級']
    },
    {
      name: '香川県産 讃岐うどん 20食分',
      price: 6000,
      category: 'other',
      region: '香川県',
      description: '本場讃岐の職人が作るコシのあるうどんをご家庭で。',
      tags: ['讃岐うどん', '香川', '本場']
    },
    {
      name: '宮城県産 ササニシキ 5kg',
      price: 10000,
      category: 'rice',
      region: '宮城県',
      description: '宮城が誇る上品な味わいのササニシキです。',
      tags: ['米', 'ササニシキ', '宮城']
    },
    {
      name: '岐阜県産 飛騨牛セット',
      price: 25000,
      category: 'meat',
      region: '岐阜県',
      description: '飛騨の豊かな自然で育った飛騨牛の贅沢セットです。',
      tags: ['飛騨牛', '岐阜', 'ブランド牛']
    },
    {
      name: '温泉旅館宿泊券',
      price: 50000,
      category: 'experience',
      region: '群馬県',
      description: '草津温泉の老舗旅館での1泊2日宿泊券です。',
      tags: ['温泉', '宿泊券', '草津']
    }
  ]

  return products.map((product, index) => ({
    id: `product-${index + 1}`,
    name: product.name!,
    price: product.price!,
    originalPrice: Math.round(product.price! * 1.3),
    taxBenefit: Math.round(product.price! * 0.3),
    category: product.category!,
    service: services[index % services.length],
    imageUrl: `/images/products/product-${index + 1}.jpg`,
    description: product.description!,
    region: product.region!,
    tags: product.tags!,
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 500) + 10
  }))
}

export const useProducts = () => {
  const { getAllProducts, getProductsByCategory } = useDatabase()
  
  const products = ref<FurusatoProduct[]>([])
  const loading = ref(false)
  
  const loadProducts = async () => {
    loading.value = true
    try {
      products.value = getAllProducts()
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      loading.value = false
    }
  }
  
  const refreshProducts = () => {
    products.value = getAllProducts()
    return products.value.length
  }
  
  const getProductById = (id: string) => {
    return products.value.find(p => p.id === id)
  }
  
  const searchProducts = (query: string) => {
    if (!query) return products.value
    
    const lowerQuery = query.toLowerCase()
    return products.value.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.region.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
  
  const filterByCategory = (category: string) => {
    if (category === 'all') return products.value
    return getProductsByCategory(category)
  }
  
  const getPopularProducts = (limit: number = 10) => {
    return [...products.value]
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, limit)
  }
  
  return {
    products: readonly(products),
    loading: readonly(loading),
    loadProducts,
    refreshProducts,
    getProductById,
    searchProducts,
    filterByCategory,
    getPopularProducts
  }
}