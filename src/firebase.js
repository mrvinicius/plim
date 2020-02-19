import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDDBj4JqgGk0RxFlH6kIbVTO90sn4ET92o",
  authDomain: "plim-80238.firebaseapp.com",
  databaseURL: "https://plim-80238.firebaseio.com",
  projectId: "plim-80238",
  storageBucket: "plim-80238.appspot.com",
  messagingSenderId: "654491643756",
  appId: "1:654491643756:web:474854d7b3d97e792b0d49"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp;