import type { FurusatoProduct, UserAction, Recommendation, UserPreferences } from '~/types'

export const useDatabase = () => {
  const isInitialized = ref(false)
  let db: any = null

  const initDatabase = async () => {
    if (process.client && !isInitialized.value) {
      try {
        const SQL = await import('sql.js')
        const sqljs = await SQL.default({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`
        })
        
        db = new sqljs.Database()
        
        // Create tables
        db.run(`
          CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            original_price INTEGER NOT NULL,
            tax_benefit INTEGER NOT NULL,
            category TEXT NOT NULL,
            service_id TEXT NOT NULL,
            service_name TEXT NOT NULL,
            image_url TEXT,
            description TEXT,
            region TEXT,
            tags TEXT,
            rating REAL DEFAULT 0,
            review_count INTEGER DEFAULT 0
          )
        `)
        
        db.run(`
          CREATE TABLE IF NOT EXISTS user_actions (
            id TEXT PRIMARY KEY,
            product_id TEXT NOT NULL,
            action_type TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            spending_type TEXT,
            FOREIGN KEY(product_id) REFERENCES products(id)
          )
        `)
        
        db.run(`
          CREATE TABLE IF NOT EXISTS recommendations (
            id TEXT PRIMARY KEY,
            product_ids TEXT NOT NULL,
            date TEXT NOT NULL,
            reason TEXT NOT NULL,
            shown INTEGER DEFAULT 0,
            clicked INTEGER DEFAULT 0
          )
        `)
        
        db.run(`
          CREATE TABLE IF NOT EXISTS user_preferences (
            id INTEGER PRIMARY KEY,
            favorite_categories TEXT,
            budget_min INTEGER DEFAULT 0,
            budget_max INTEGER DEFAULT 100000,
            investment_focus INTEGER DEFAULT 0,
            excluded_services TEXT
          )
        `)
        
        isInitialized.value = true
        await loadInitialData()
      } catch (error) {
        console.error('Database initialization failed:', error)
      }
    }
  }

  const loadInitialData = async () => {
    if (!db) return
    
    const productsCount = db.exec("SELECT COUNT(*) as count FROM products")[0]?.values[0]?.[0]
    if (productsCount === 0) {
      await insertMockProducts()
    }
  }

  const insertMockProducts = async () => {
    const mockProducts = await generateMockProducts()
    
    const stmt = db.prepare(`
      INSERT INTO products (
        id, name, price, original_price, tax_benefit, category, 
        service_id, service_name, image_url, description, region, 
        tags, rating, review_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const product of mockProducts) {
      stmt.run([
        product.id,
        product.name,
        product.price,
        product.originalPrice,
        product.taxBenefit,
        product.category,
        product.service.id,
        product.service.name,
        product.imageUrl,
        product.description,
        product.region,
        JSON.stringify(product.tags),
        product.rating,
        product.reviewCount
      ])
    }
    
    stmt.free()
  }

  const getAllProducts = (): FurusatoProduct[] => {
    if (!db) return []
    
    const result = db.exec("SELECT * FROM products ORDER BY rating DESC, review_count DESC")
    if (!result.length) return []
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      price: row[2],
      originalPrice: row[3],
      taxBenefit: row[4],
      category: row[5],
      service: {
        id: row[6],
        name: row[7],
        url: '',
        logoUrl: ''
      },
      imageUrl: row[8],
      description: row[9],
      region: row[10],
      tags: JSON.parse(row[11] || '[]'),
      rating: row[12],
      reviewCount: row[13]
    }))
  }

  const getProductsByCategory = (category: string): FurusatoProduct[] => {
    if (!db) return []
    
    const result = db.exec("SELECT * FROM products WHERE category = ? ORDER BY rating DESC", [category])
    if (!result.length) return []
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      price: row[2],
      originalPrice: row[3],
      taxBenefit: row[4],
      category: row[5],
      service: {
        id: row[6],
        name: row[7],
        url: '',
        logoUrl: ''
      },
      imageUrl: row[8],
      description: row[9],
      region: row[10],
      tags: JSON.parse(row[11] || '[]'),
      rating: row[12],
      reviewCount: row[13]
    }))
  }

  const addUserAction = (action: UserAction) => {
    if (!db) return
    
    db.run(`
      INSERT INTO user_actions (id, product_id, action_type, timestamp, spending_type)
      VALUES (?, ?, ?, ?, ?)
    `, [
      action.id,
      action.productId,
      action.actionType,
      action.timestamp.getTime(),
      action.spendingType || null
    ])
  }

  const getUserActions = (): UserAction[] => {
    if (!db) return []
    
    const result = db.exec("SELECT * FROM user_actions ORDER BY timestamp DESC")
    if (!result.length) return []
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      productId: row[1],
      actionType: row[2],
      timestamp: new Date(row[3]),
      spendingType: row[4]
    }))
  }

  const saveRecommendation = (recommendation: Recommendation) => {
    if (!db) return
    
    db.run(`
      INSERT OR REPLACE INTO recommendations (id, product_ids, date, reason, shown, clicked)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      recommendation.id,
      JSON.stringify(recommendation.productIds),
      recommendation.date,
      recommendation.reason,
      recommendation.shown ? 1 : 0,
      recommendation.clicked ? 1 : 0
    ])
  }

  const getRecommendations = (): Recommendation[] => {
    if (!db) return []
    
    const result = db.exec("SELECT * FROM recommendations ORDER BY date DESC")
    if (!result.length) return []
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      productIds: JSON.parse(row[1]),
      date: row[2],
      reason: row[3],
      shown: row[4] === 1,
      clicked: row[5] === 1
    }))
  }

  return {
    isInitialized: readonly(isInitialized),
    initDatabase,
    getAllProducts,
    getProductsByCategory,
    addUserAction,
    getUserActions,
    saveRecommendation,
    getRecommendations
  }
}