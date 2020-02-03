import firebase from '../firebase'

const localStorageKey = 'plim_token'

export function getUser(params) {

  // return Promise.resolve({})
  return Promise.resolve(null)
}

export function register({ email, password }) {
  firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // ...
    });
}

export function login({ email, password }) {
  firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // ...
    });
}

export function logout() {
  window.localStorage.removeItem(localStorageKey)
  return Promise.resolve()
}

export function getToken() {
  return window.localStorage.getItem(localStorageKey)
}