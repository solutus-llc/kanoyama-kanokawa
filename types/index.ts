export interface FurusatoProduct {
  id: string
  name: string
  price: number
  originalPrice: number
  taxBenefit: number
  category: ProductCategory
  service: FurusatoService
  imageUrl: string
  description: string
  region: string
  tags: string[]
  rating: number
  reviewCount: number
}

export interface FurusatoService {
  id: string
  name: string
  url: string
  logoUrl: string
}

export type ProductCategory = 
  | 'meat' | 'seafood' | 'rice' | 'fruit' | 'vegetable' 
  | 'sweets' | 'drink' | 'craft' | 'experience' | 'other'

export type SpendingType = 'consumption' | 'waste' | 'investment'

export interface UserAction {
  id: string
  productId: string
  actionType: 'view' | 'click' | 'purchase' | 'favorite'
  timestamp: Date
  spendingType?: SpendingType
}

export interface Recommendation {
  id: string
  productIds: string[]
  date: string
  reason: string
  shown: boolean
  clicked: boolean
}

export interface UserPreferences {
  favoriteCategories: ProductCategory[]
  budgetRange: {
    min: number
    max: number
  }
  investmentFocus: boolean
  excludedServices: string[]
}