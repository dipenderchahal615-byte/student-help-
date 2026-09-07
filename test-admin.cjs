const admin = require('firebase-admin');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

admin.initializeApp({
  projectId: config.projectId
});

const db = admin.firestore();
if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
  admin.firestore().settings({ databaseId: config.firestoreDatabaseId });
}

db.collection('test').add({ msg: 'hello from admin' }).then(() => {
  console.log('Success!');
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
