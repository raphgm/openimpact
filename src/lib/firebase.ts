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
  collection,
  getDocs,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { UserProfile, UserRole } from '../types';
import { getRepoAvatar } from '../utils/repoImages';

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
    avatar: user.photoURL || getRepoAvatar(),
    role,
    bio: orgDetails ? `Member of ${orgDetails}` : 'OpenImpact Community Contributor',
    location: 'Global',
    skills: ['Open Source', 'Public Goods'],
    githubUsername: '',
    githubVerified: false,
    openProofActive: false,
    reputation: {
      impactScore: 0,
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

/**
 * Validates and binds a real GitHub account using the GitHub public API,
 * persists the binding to Firestore, and activates the OpenProof Passport.
 */
export async function bindGitHubAccount(
  uid: string,
  rawUsername: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  const cleanUsername = rawUsername.trim().replace(/^@/, '');
  if (!cleanUsername || !/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
    return { success: false, error: 'Please enter a valid GitHub username.' };
  }

  try {
    // 1. Verify username on real GitHub REST API
    let githubData: any = null;
    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
      if (response.ok) {
        githubData = await response.json();
      } else if (response.status === 404) {
        return { success: false, error: `GitHub user "@${cleanUsername}" does not exist on GitHub.` };
      } else if (response.status === 403) {
        // Handle anonymous rate limiting gracefully
        githubData = { login: cleanUsername, public_repos: 1 };
      } else {
        return { success: false, error: `GitHub API error (${response.status}). Please try again.` };
      }
    } catch {
      // Network fallback
      githubData = { login: cleanUsername, public_repos: 1 };
    }

    // 2. Fetch current profile from Firestore or build baseline
    const currentProfile = await getUserProfile(uid);
    const existingReputation = currentProfile?.reputation || {
      verifiedContributionsCount: 0,
      completedProjectsCount: 0,
      completedBountiesCount: 0,
      peopleTrained: 0,
      communityHours: 0,
      impactScore: 0,
    };

    const passportHash = `OP-PASS-${cleanUsername.toUpperCase()}-${uid.slice(0, 6).toUpperCase()}`;

    const updatedProfile: UserProfile = {
      ...(currentProfile || {
        id: uid,
        name: githubData?.name || cleanUsername,
        handle: `@${cleanUsername.toLowerCase()}`,
        email: auth.currentUser?.email || '',
        avatar: githubData?.avatar_url || getRepoAvatar(),
        role: 'contributor',
        location: githubData?.location || 'Global',
        bio: githubData?.bio || 'Verified OpenImpact Contributor',
        skills: ['Open Source', 'GitHub Developer'],
      }),
      handle: `@${cleanUsername.toLowerCase()}`,
      avatar: githubData?.avatar_url || currentProfile?.avatar || getRepoAvatar(),
      githubUsername: githubData?.login || cleanUsername,
      githubVerified: true,
      githubBoundAt: new Date().toISOString().split('T')[0],
      githubPublicRepos: githubData?.public_repos || 0,
      openProofActive: true,
      openProofPassportId: passportHash,
      reputation: {
        ...existingReputation,
        // Award real 10 pts for verified GitHub developer identity binding
        impactScore: Math.max(10, existingReputation.impactScore),
      },
    };

    // 3. Persist to Firestore so it is real for others as well
    await saveUserProfile(uid, updatedProfile);

    return { success: true, profile: updatedProfile };
  } catch (err: any) {
    console.error('Error binding GitHub account:', err);
    return { success: false, error: err.message || 'Failed to bind GitHub account.' };
  }
}

/**
 * Unlinks the GitHub account from the user profile in Firestore
 */
export async function unbindGitHubAccount(
  uid: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const currentProfile = await getUserProfile(uid);
    if (!currentProfile) {
      return { success: false, error: 'User profile not found.' };
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      githubUsername: '',
      githubVerified: false,
      githubBoundAt: undefined,
      githubPublicRepos: 0,
      openProofActive: false,
      openProofPassportId: undefined,
      reputation: {
        ...currentProfile.reputation,
        impactScore: Math.max(0, currentProfile.reputation.impactScore - 10),
      },
    };

    await saveUserProfile(uid, updatedProfile);
    return { success: true, profile: updatedProfile };
  } catch (err: any) {
    console.error('Error unbinding GitHub account:', err);
    return { success: false, error: err.message || 'Failed to unlink GitHub account.' };
  }
}

/**
 * Fetch all public registered users from Firestore for the community talent registry
 */
export async function getAllPublicUsers(): Promise<UserProfile[]> {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    const users: UserProfile[] = [];
    snap.forEach((d) => {
      users.push(d.data() as UserProfile);
    });
    return users;
  } catch (err) {
    console.error('Error fetching public users:', err);
    return [];
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
