import { 
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Widget, RoleWidgetConfig } from '@/types/widgets'
import type { UserRole } from '@/types/user'
import { roleWidgetConfigs } from '@/config/widgets'

const COLLECTION_NAME = 'widgetConfigs'

// Get widget configuration for a specific role
export const getWidgetConfigByRole = async (role: UserRole): Promise<RoleWidgetConfig | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, role)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as RoleWidgetConfig
    }
    
    // If no config exists in Firestore, return the mock config
    return roleWidgetConfigs.find(config => config.role === role) || null
  } catch (error) {
    console.error('Error getting widget config:', error)
    // Fallback to mock data
    return roleWidgetConfigs.find(config => config.role === role) || null
  }
}

// Initialize widget configurations in Firestore
export const initializeWidgetConfigs = async (): Promise<void> => {
  try {
    // Create a batch of promises to set all configurations
    const promises = roleWidgetConfigs.map(config => 
      setDoc(doc(db, COLLECTION_NAME, config.role), config)
    )
    
    await Promise.all(promises)
    console.log('Widget configurations initialized successfully')
  } catch (error) {
    console.error('Error initializing widget configs:', error)
    throw error
  }
}

// Update widget configuration for a role
export const updateWidgetConfig = async (role: UserRole, config: Partial<RoleWidgetConfig>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, role)
    await setDoc(docRef, config, { merge: true })
  } catch (error) {
    console.error('Error updating widget config:', error)
    throw error
  }
}

// Get all widget configurations
export const getAllWidgetConfigs = async (): Promise<RoleWidgetConfig[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    return querySnapshot.docs.map(doc => doc.data() as RoleWidgetConfig)
  } catch (error) {
    console.error('Error getting all widget configs:', error)
    // Fallback to mock data
    return roleWidgetConfigs
  }
} 