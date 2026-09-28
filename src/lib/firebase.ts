import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        id: user.uid,
        name: user.displayName || 'Google User',
        handle: `@${(user.displayName || 'user').toLowerCase().replace(/\s+/g, '')}`,
        email: user.email || 'user@openimpact.io',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'contributor' as const,
        bio: 'Authenticated via Google Firebase Auth',
        location: 'Global',
        reputation: {
          impactScore: 60,
          verifiedContributionsCount: 1,
          completedProjectsCount: 1,
          completedBountiesCount: 0,
          peopleTrained: 0,
          communityHours: 20,
        },
        skills: ['Google Auth', 'Open Source'],
      },
    };
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return { success: false, error: error.message };
  }
}
