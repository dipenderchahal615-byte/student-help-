import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

addDoc(collection(db, 'blogs'), { title: 'Test', serverSecret: 'MY_SECRET_123' })
  .then(() => {
    console.log('Success client!');
    process.exit(0);
  })
  .catch(e => {
    console.error('Error client:', e.message);
    process.exit(1);
  });
