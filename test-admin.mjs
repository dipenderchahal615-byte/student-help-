import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

initializeApp({
  projectId: config.projectId
});

const db = getFirestore();
if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
  db.settings({ databaseId: config.firestoreDatabaseId });
}

db.collection('test').add({ msg: 'hello from admin' }).then(() => {
  console.log('Success!');
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
