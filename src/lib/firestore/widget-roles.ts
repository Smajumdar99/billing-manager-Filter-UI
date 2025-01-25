import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { RoleBoxWidget } from '@/types/widget';

interface RoleBoxData {
  id: string;
  title: string;
  description: string;
  widgets: RoleBoxWidget[];
}

export const saveWidgetRoles = async (roleBoxes: RoleBoxData[]) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('No user logged in, cannot save widget roles');
      return false;
    }

    console.log('Current user ID:', currentUser.uid);
    const docRef = doc(db, 'userSettings', currentUser.uid);
    
    const data = {
      dashboardLayout: {
        widgetRoles: roleBoxes,
      },
      updatedAt: new Date().toISOString()
    };
    
    console.log('Saving data to Firestore:', {
      path: `userSettings/${currentUser.uid}`,
      data: data
    });

    await setDoc(docRef, data, { merge: true });
    
    // Verify the save by reading back
    const verifyDoc = await getDoc(docRef);
    console.log('Verification read:', verifyDoc.data());
    
    return true;
  } catch (error) {
    console.error('Error saving widget roles:', error);
    return false;
  }
};

export const getWidgetRoles = async (): Promise<RoleBoxData[] | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('No user logged in, cannot get widget roles');
      return null;
    }

    console.log('Getting widget roles for user:', currentUser.uid);
    const docRef = doc(db, 'userSettings', currentUser.uid);
    const docSnap = await getDoc(docRef);
    
    console.log('Retrieved document:', docSnap.data());
    
    if (docSnap.exists() && docSnap.data()?.dashboardLayout?.widgetRoles) {
      return docSnap.data().dashboardLayout.widgetRoles;
    }
    return null;
  } catch (error) {
    console.error('Error getting widget roles:', error);
    return null;
  }
}; 