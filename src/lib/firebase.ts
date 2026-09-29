import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { UserProfile, UserRole } from '../types';

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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on initialization
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected authentication error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Please use "Sign in with Google" or enable Email/Password in Firebase Authentication settings.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please switch to Log In.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials or sign in with Google.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed attempts. Please try again later.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

export function buildDefaultUserProfile(
  user: FirebaseUser,
  role: UserRole = 'contributor',
  customName?: string,
  orgDetails?: string
): UserProfile {
  const displayName = customName || user.displayName || user.email?.split('@')[0] || 'OpenImpact Member';
  const cleanHandle = `@${displayName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'member'}`;

  return {
    id: user.uid,
    name: displayName,
    handle: cleanHandle,
    email: user.email || '',
    avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role,
    bio: orgDetails ? `Member of ${orgDetails}` : 'OpenImpact Verified Public Goods Member',
    location: 'Global',
    skills: ['Open Source', 'Public Goods', 'Verifiable Impact'],
    reputation: {
      impactScore: 50,
      verifiedContributionsCount: 0,
      completedProjectsCount: 0,
      completedBountiesCount: 0,
      peopleTrained: 0,
      communityHours: 0,
    },
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  const docRef = doc(db, 'users', uid);
  try {
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}

export async function signInWithGoogle(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    let profile = await getUserProfile(fbUser.uid);
    if (!profile) {
      profile = buildDefaultUserProfile(fbUser, 'contributor');
      await saveUserProfile(fbUser.uid, profile);
    }

    return { success: true, user: profile };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    return { success: false, error: formatAuthError(error) };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'contributor',
  orgDetails?: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;

    if (name.trim()) {
      try {
        await updateProfile(fbUser, { displayName: name.trim() });
      } catch (e) {
        console.warn('Could not update displayName on auth user:', e);
      }
    }

    const profile = buildDefaultUserProfile(fbUser, role, name, orgDetails);
    await saveUserProfile(fbUser.uid, profile);

    return { success: true, user: profile };
  } catch (error: any) {
    console.error('Email Sign-Up Error:', error);
    return { success: false, error: formatAuthError(error) };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;

    let profile = await getUserProfile(fbUser.uid);
    if (!profile) {
      profile = buildDefaultUserProfile(fbUser, 'contributor');
      await saveUserProfile(fbUser.uid, profile);
    }

    return { success: true, user: profile };
  } catch (error: any) {
    console.error('Email Sign-In Error:', error);
    return { success: false, error: formatAuthError(error) };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };
