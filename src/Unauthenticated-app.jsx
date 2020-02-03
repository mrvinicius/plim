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

export default function UnauthenticatedApp() {
  return (
    <main className="Unauthenticated-app">
      <Router>
        <Route path="/entrar" component={Login} />
        <Route path="/cadastro" component={Register} />       
        <Route path="/recuperar" component={Recover} />       
        <Redirect path="/recuperar" to="/entrar" />       
      </Router>
    </main>
  )
}

function Login() {
  let emailInput
  let passwordInput

  function login() {
    console.log({ emailInput, passwordInput });
  }

  return (
    <>
      <h1 className="mb0 mt0 Unauthenticated-app__title">Entrar</h1>
      <p className="Unauthenticated-app__text mt0">
        É novo?
        <Link to="/cadastro" className="fw500"> Criar conta</Link>
      </p>
      <InputField 
        label='E-mail' 
        inputRef={el => emailInput = el} 
      />
      <InputField
        label='Senha'
        className="mb0"
        inputRef={el => passwordInput = el}
      />
      <div className="Unauthenticated-app__forget right mt05em">
        <Link to="/recuperar" className="fw500">Esqueceu a senha?</Link>
      </div>
      <Button
        onClick={login}
        children="Entrar"
      />
      <Button children="Entrar com Google" type="outlined" />
    </>
  )
}

function Register() {
  let emailInput
  let passwordInput

  function register() {
    console.log({ emailInput, passwordInput });
  }

  return (
    <>
      <h1 className="mb0 mt0 Unauthenticated-app__title">Nova conta</h1>
      <p className="Unauthenticated-app__text mt0">
        Já tem conta?
        <Link to="/entrar"> Faça login</Link>
      </p>
      <form>

      <InputField
        label='E-mail'
        inputRef={el => emailInput = el}
      />
      <InputField
        label='Senha'
        inputRef={el => passwordInput = el}
      />
      <Button
        onClick={register}
        className="mt05em"
        children="Criar conta"
      />
      </form>
      <Button children="Entrar com Google" type="outlined" />
    </>
  )
}

function Recover() {
  return <div>a</div>
}