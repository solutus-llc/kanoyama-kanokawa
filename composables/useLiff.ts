export const useLiff = () => {
  const isLiffReady = ref(false)
  const isLoggedIn = ref(false)
  const userProfile = ref<any>(null)
  const isInClient = ref(false)
  
  const initLiff = async () => {
    if (process.client) {
      isInClient.value = true
      
      try {
        const liff = await import('@line/liff')
        
        await liff.default.init({
          liffId: process.env.NUXT_PUBLIC_LIFF_ID || '1234567890-abcdefgh'
        })
        
        isLiffReady.value = true
        
        if (liff.default.isLoggedIn()) {
          isLoggedIn.value = true
          userProfile.value = await liff.default.getProfile()
        }
        
        console.log('LIFF initialized successfully')
      } catch (error) {
        console.error('LIFF initialization failed:', error)
        // LIFF環境でない場合のフォールバック
        isLiffReady.value = true
        isLoggedIn.value = true
        userProfile.value = {
          userId: 'demo-user',
          displayName: 'デモユーザー',
          pictureUrl: '',
          statusMessage: ''
        }
      }
    }
  }
  
  const login = async () => {
    if (!isInClient.value) return
    
    try {
      const liff = await import('@line/liff')
      
      if (!liff.default.isLoggedIn()) {
        liff.default.login()
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  const logout = async () => {
    if (!isInClient.value) return
    
    try {
      const liff = await import('@line/liff')
      
      if (liff.default.isLoggedIn()) {
        liff.default.logout()
        isLoggedIn.value = false
        userProfile.value = null
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  const shareTargetPicker = async (message: string) => {
    if (!isInClient.value) return
    
    try {
      const liff = await import('@line/liff')
      
      if (liff.default.isApiAvailable('shareTargetPicker')) {
        await liff.default.shareTargetPicker([
          {
            type: 'text',
            text: message
          }
        ])
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }
  
  const openExternalWindow = (url: string) => {
    if (!isInClient.value) return
    
    if (process.client) {
      import('@line/liff').then(liff => {
        if (liff.default.isApiAvailable('openWindow')) {
          liff.default.openWindow({
            url,
            external: true
          })
        } else {
          window.open(url, '_blank')
        }
      })
    }
  }
  
  const isLiffEnvironment = computed(() => {
    return isInClient.value && isLiffReady.value
  })
  
  return {
    isLiffReady: readonly(isLiffReady),
    isLoggedIn: readonly(isLoggedIn),
    userProfile: readonly(userProfile),
    isLiffEnvironment,
    initLiff,
    login,
    logout,
    shareTargetPicker,
    openExternalWindow
  }
}