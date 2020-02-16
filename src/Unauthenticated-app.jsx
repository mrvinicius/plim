import React from 'react'
import { Link } from "react-router-dom";
import {
	BrowserRouter as Router,
  Route,
  Redirect
	// Switch
} from "react-router-dom";

import './Unauthenticated-app.css'
import InputField from './shared/input-field'
import Button from './shared/button'
import { useAuth } from './context/auth-context'

export default function UnauthenticatedApp() {
  return (
    <main className="Unauthenticated-app">
      <Router>
        <Route path="/entrar" component={Login} />
        <Route path="/cadastro" component={Register} />
        <Route path="/recuperar" component={Recover} />
        <Route path="/" render={props => <Redirect to="/entrar" />} />
      </Router>
    </main>
  )
}

function Login() {
  const { login } = useAuth()
  let emailInput
  let passwordInput

  function showInvalidEmail() {
    // error.message 'The email address is badly formatted'  
  }

  function showWrongPassword() {
    // campo vazio ou não tem senha
    // error.message 'The password is invalid or the user does not have a password.'
  }

  function showUserNotFound() {
    // email não encontrado
    // error.message 'The password is invalid or the user does not have a password.'  
  }

  function showUnknownError() {
    
  }

  function handleSubmit(e) {
    e.preventDefault()
    login({ email: emailInput.value, password: passwordInput.value })
      .then(function(response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
        switch (error.code) {
          case 'auth/invalid-email': return showInvalidEmail()
          case 'auth/wrong-password': return showWrongPassword()
          case 'auth/user-not-found': return showUserNotFound()
          default: return showUnknownError()
        }
      });
  }

  return (
    <>
      <h1 className="mb0 mt0 Unauthenticated-app__title">Entrar</h1>
      <p className="Unauthenticated-app__text mt0">
        É novo?
        <Link to="/cadastro" className="fw500"> Criar conta</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <InputField 
          label="E-mail" 
          inputRef={el => emailInput = el}
          type="email"
          inputMode="email"
          autoComplete="off"
        />
        <InputField
          label="Senha"
          className="mb0"
          inputRef={el => passwordInput = el}
          type="password"
          autoComplete="off"
        />
        <div className="Unauthenticated-app__forget right mt05em">
          <Link to="/recuperar" className="fw500">Esqueceu a senha?</Link>
        </div>
        <Button
          children="Entrar"
        />
      </form>
      {/* <GoogleButton /> */}
    </>
  )
}

function Register() {
  const { register } = useAuth()
  let emailInput
  let passwordInput

  function showInvalidEmail() {
    // error.message 'The email address is badly formatted'  
  }

  function showWeakPassword() {
    // error.messagemessage: "The password must be 6 characters long or more."
  }

  function showEmailAlreadyInUse() {
    
  }

  function showUnknownError() {
    
  }

  function handleSubmit(e) {
    e.preventDefault()
    register({ email: emailInput.value, password: passwordInput.value })
      .then(function(response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
        switch (error.code) {
          case 'auth/invalid-email': return showInvalidEmail()
          case 'auth/weak-password': return showWeakPassword()
          case 'auth/email-already-in-use': return showEmailAlreadyInUse()
          default: return showUnknownError()
        }
      });
  }

  return (
    <>
      <h1 className="mb0 mt0 Unauthenticated-app__title">Nova conta</h1>
      <p className="Unauthenticated-app__text mt0">
        Já tem conta?
        <Link to="/entrar"> Faça login</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <InputField
          label="E-mail"
          inputRef={el => emailInput = el}
          type="email"
          inputMode="email"
          autoComplete="off"
        />
        <InputField
          label="Senha"
          inputRef={el => passwordInput = el}
          type="password"
          autoComplete="new-password"
        />
        <Button
          onClick={handleSubmit}
          className="mt05em"
          children="Criar conta"
        />
      </form>
      {/* <GoogleButton /> */}
    </>
  )
}

function Recover() {
  return <div>a</div>
}

// eslint-disable-next-line no-unused-vars
function GoogleButton() {
  return <Button children="Entrar com Google" type="outlined" />
}