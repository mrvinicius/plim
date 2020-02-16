import React from 'react'
import * as authClient from '../shared/auth-client'

const AuthContext = React.createContext()

function AuthProvider(props) { 
  const login = form => authClient.login(form)
  const register = form => authClient.register(form)
  const logout = () => authClient.logout()
  const [data, setData] = React.useState({ user: null })
  
  React.useEffect(() => {
    authClient.onAuthStateChanged(user => setData({ user }))
  }, []);

  return (
    <AuthContext.Provider value={{ data, login, logout, register }} {...props} />
  )
}

function useAuth() {
  const context = React.useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export { AuthProvider, useAuth }
