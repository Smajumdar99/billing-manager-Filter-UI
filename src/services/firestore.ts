import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { UserSettings } from '@/types/user'
import { db } from '@/lib/firebase'
import { defaultLayouts } from '@/pages/dashboard'
import { WidgetLayout } from '@/types/widget'

export const userSettingsCollection = 'userSettings'

const sanitizeFirestoreData = (data: any): any => {
  if (data === null || data === undefined) {
    return null
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeFirestoreData(item))
  }

  if (typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const sanitizedValue = sanitizeFirestoreData(value)
      if (sanitizedValue !== undefined && sanitizedValue !== null) {
        acc[key] = sanitizedValue
      }
      return acc
    }, {} as Record<string, any>)
  }

  return data
}

const sanitizeLayoutData = (layouts: any) => {
  if (!layouts) return null
  
  const validBreakpoints = ['lg', 'md', 'sm']
  return validBreakpoints.reduce((acc, breakpoint) => {
    if (layouts[breakpoint] && Array.isArray(layouts[breakpoint])) {
      acc[breakpoint] = layouts[breakpoint].map(item => ({
        i: String(item.i),
        x: Number(item.x) || 0,
        y: Number(item.y) || 0,
        w: Number(item.w) || 4,
        h: Number(item.h) || 3,
        minW: Number(item.minW) || 3,
        minH: Number(item.minH) || 2
      }))
    }
    return acc
  }, {} as Record<string, WidgetLayout[]>)
}

export const saveUserSettings = async (userId: string, newSettings: Partial<UserSettings>) => {
  try {
    console.log('Saving settings to Firestore:', newSettings)
    const userSettingsRef = doc(db, 'userSettings', userId)
    
    // Get existing settings
    const existingSettings = await getUserSettings(userId)
    
    // Merge with existing settings
    const mergedSettings = {
      id: userId,
      userId,
      createdAt: existingSettings?.createdAt || new Date(),
      updatedAt: new Date(),
      ...existingSettings,  // Spread existing settings
      ...newSettings,       // Spread new settings to override
    }

    // Save merged settings
    await setDoc(userSettingsRef, sanitizeFirestoreData(mergedSettings), { merge: true })
    console.log('Settings saved successfully')
  } catch (error) {
    console.error('Error saving user settings:', error)
    throw error
  }
}

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    console.log('Getting user settings for:', userId)
    const docRef = doc(db, 'userSettings', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      console.log('Retrieved settings:', data)
      return data as UserSettings
    }
    console.log('No settings found')
    return null
  } catch (error) {
    console.error('Error getting user settings:', error)
    return null
  }
} 