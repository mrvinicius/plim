import React from 'react'
import * as authClient from '../shared/auth-client'

const AuthContext = React.createContext()

function AuthProvider(props) { 
  const login = form => authClient.login(form)//.then(reload)
  const register = form => authClient.register(form)//.then(reload)
  const logout = () => authClient.logout()//.then(reload)
  const [data, setData] = React.useState({ user: null })
  
  React.useEffect(() => {
    authClient.getUser().then(user => setData({ user }))
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
