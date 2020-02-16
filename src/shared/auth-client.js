import firebase from '../firebase'

const auth = firebase.auth()

export function onAuthStateChanged(callback) {
  auth.onAuthStateChanged(callback)
}

// export function getUser(params) {

//   return Promise.resolve({})
//   // return Promise.resolve(null)
// }

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