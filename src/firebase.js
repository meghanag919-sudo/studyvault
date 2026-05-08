import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDeYs2aq1CkRUGMFt1O89C0WSE4ap1SFHQ',
  authDomain: 'studyvault-3ce2d.firebaseapp.com',
  projectId: 'studyvault-3ce2d',
  storageBucket: 'studyvault-3ce2d.firebasestorage.app',
  messagingSenderId: '778901830213',
  appId: '1:778901830213:web:bf608c735ba48fcc74012c',
  measurementId: 'G-9G79WVVVLD',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
