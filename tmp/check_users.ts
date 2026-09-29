import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, config.firestoreDatabaseId);

async function main() {
  const snap = await getDocs(collection(db, 'users'));
  console.log(`Found ${snap.size} users:`);
  snap.forEach(doc => {
    const data = doc.data();
    console.log({
      id: doc.id,
      name: data.name,
      email: data.email,
      handle: data.handle,
      role: data.role,
      githubUsername: data.githubUsername,
      githubVerified: data.githubVerified
    });
  });
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
