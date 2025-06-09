import type { FurusatoProduct, Recommendation, UserAction, SpendingType } from '~/types'
import { format, isToday } from 'date-fns'

export const useRecommendations = () => {
  const { getAllProducts } = useDatabase()
  const { getUserActions, saveRecommendation, getRecommendations } = useDatabase()
  
  const recommendations = ref<Recommendation[]>([])
  const todaysRecommendations = ref<FurusatoProduct[]>([])
  
  const generateTodaysRecommendations = (): FurusatoProduct[] => {
    const products = getAllProducts()
    const userActions = getUserActions()
    const existingRecommendations = getRecommendations()
    
    // 今日の推薦がすでにあるかチェック
    const today = format(new Date(), 'yyyy-MM-dd')
    const todaysExistingRec = existingRecommendations.find(rec => rec.date === today)
    
    if (todaysExistingRec) {
      return todaysExistingRec.productIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) as FurusatoProduct[]
    }
    
    // ユーザーの行動履歴を分析
    const userPreferences = analyzeUserPreferences(userActions, products)
    
    // 推薦アルゴリズム
    const scored = products.map(product => ({
      product,
      score: calculateRecommendationScore(product, userPreferences, userActions)
    }))
    
    // スコア順にソートして上位3つを選択
    const recommended = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.product)
    
    // 推薦を保存
    const recommendation: Recommendation = {
      id: `rec-${today}`,
      productIds: recommended.map(p => p.id),
      date: today,
      reason: generateRecommendationReason(userPreferences),
      shown: false,
      clicked: false
    }
    
    saveRecommendation(recommendation)
    
    return recommended
  }
  
  const analyzeUserPreferences = (actions: UserAction[], products: FurusatoProduct[]) => {
    const categoryCount: Record<string, number> = {}
    const priceRange = { min: 0, max: 100000 }
    let totalActions = 0
    let investmentFocused = false
    
    actions.forEach(action => {
      const product = products.find(p => p.id === action.productId)
      if (product) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
        totalActions++
        
        // 投資型の購買が多いかチェック
        if (action.spendingType === 'investment') {
          investmentFocused = true
        }
      }
    })
    
    // よく見ているカテゴリを特定
    const favoriteCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)
    
    return {
      favoriteCategories,
      priceRange,
      investmentFocused,
      totalActions
    }
  }
  
  const calculateRecommendationScore = (
    product: FurusatoProduct, 
    preferences: any, 
    actions: UserAction[]
  ): number => {
    let score = 0
    
    // 基本スコア (評価 × レビュー数)
    score += product.rating * Math.log(product.reviewCount + 1)
    
    // カテゴリー好み
    if (preferences.favoriteCategories.includes(product.category)) {
      score += 20
    }
    
    // 価格帯適正性
    if (product.price >= preferences.priceRange.min && product.price <= preferences.priceRange.max) {
      score += 10
    }
    
    // 投資型商品の優先（体験、高級品など）
    if (preferences.investmentFocused) {
      if (product.category === 'experience' || product.price > 20000) {
        score += 15
      }
    }
    
    // 季節性ボーナス
    const month = new Date().getMonth() + 1
    if (isSeasonalProduct(product, month)) {
      score += 10
    }
    
    // ランダム要素（発見性のため）
    score += Math.random() * 5
    
    // 過去に見た商品は減点
    const hasViewed = actions.some(action => 
      action.productId === product.id && action.actionType === 'view'
    )
    if (hasViewed) {
      score -= 5
    }
    
    return score
  }
  
  const isSeasonalProduct = (product: FurusatoProduct, month: number): boolean => {
    const seasonal: Record<string, number[]> = {
      'fruit': {
        'りんご': [9, 10, 11],
        'みかん': [11, 12, 1],
        'さくらんぼ': [5, 6, 7],
        'マンゴー': [6, 7, 8]
      }
    }
    
    if (product.category === 'fruit') {
      for (const [fruit, months] of Object.entries(seasonal.fruit)) {
        if (product.name.includes(fruit) && months.includes(month)) {
          return true
        }
      }
    }
    
    return false
  }
  
  const generateRecommendationReason = (preferences: any): string => {
    const reasons = [
      `あなたがよく見ている${preferences.favoriteCategories[0]}カテゴリから厳選`,
      '高評価商品の中から今日のおすすめを選択',
      '季節限定商品を中心にセレクト',
      'コスパが良く人気の商品をピックアップ'
    ]
    
    return reasons[Math.floor(Math.random() * reasons.length)]
  }
  
  const categorizePurchaseType = (product: FurusatoProduct): SpendingType => {
    // 投資型: 体験、高額商品、教育・文化関連
    if (product.category === 'experience' || product.price > 30000) {
      return 'investment'
    }
    
    // 浪費型: お菓子、お酒など嗜好品
    if (product.category === 'sweets' || 
        (product.category === 'drink' && product.tags.includes('お酒'))) {
      return 'waste'
    }
    
    // 消費型: 食材、日用品
    return 'consumption'
  }
  
  const loadTodaysRecommendations = () => {
    todaysRecommendations.value = generateTodaysRecommendations()
  }
  
  const loadRecommendationHistory = () => {
    const allRecommendations = getRecommendations()
    const products = getAllProducts()
    
    recommendations.value = allRecommendations.map(rec => ({
      ...rec,
      products: rec.productIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean)
    }))
  }
  
  const markRecommendationAsShown = (recommendationId: string) => {
    const rec = getRecommendations().find(r => r.id === recommendationId)
    if (rec) {
      rec.shown = true
      saveRecommendation(rec)
    }
  }
  
  const markRecommendationAsClicked = (recommendationId: string) => {
    const rec = getRecommendations().find(r => r.id === recommendationId)
    if (rec) {
      rec.clicked = true
      saveRecommendation(rec)
    }
  }
  
  return {
    todaysRecommendations: readonly(todaysRecommendations),
    recommendations: readonly(recommendations),
    loadTodaysRecommendations,
    loadRecommendationHistory,
    categorizePurchaseType,
    markRecommendationAsShown,
    markRecommendationAsClicked
  }
}