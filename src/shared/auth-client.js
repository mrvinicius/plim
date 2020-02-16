import firebase from '../firebase'

const auth = firebase.auth()

export function onAuthStateChanged(callback) {
  auth.onAuthStateChanged(callback)
}

export function getCurrentUser() {
  return auth.currentUser // name, email, photoUrl, uid, emailVerified;
}

export function register({ email, password }) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(r => r)
}

export function login({ email, password }) {
  return auth.signInWithEmailAndPassword(email, password)
    .then(r => r)
}

export function logout() {
  auth.signOut()
}