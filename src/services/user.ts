import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { User, UserRole } from '@/types/user'

export const usersCollection = 'users'

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, usersCollection, userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as User
    }
    
    return null
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, usersCollection, userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  try {
    const q = query(
      collection(db, usersCollection),
      where('role', '==', role)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User))
  } catch (error) {
    console.error('Error getting users by role:', error)
    throw error
  }
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const q = query(
      collection(db, usersCollection),
      where('email', '==', email)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return null
    }
    
    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    } as User
  } catch (error) {
    console.error('Error getting user by email:', error)
    throw error
  }
} 