// Import the functions you need from the SDKs you need
const admin = require('firebase-admin')
const serviceAccount = require('./key_admin_firebase.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
const firebaseConfig = {
  apiKey: 'AIzaSyCLFqnAJR9YzrMo633CwhiRQ78ueMpK6Hk',
  authDomain: 'boost-quizz-app.firebaseapp.com',
  projectId: 'boost-quizz-app',
  storageBucket: 'boost-quizz-app.appspot.com',
  messagingSenderId: '894713822636',
  appId: '1:894713822636:web:46040d096e20a56f1ece09',
}

module.exports = admin
