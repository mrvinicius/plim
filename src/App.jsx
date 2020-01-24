import React, { Suspense } from 'react'
// import {useUser} from './context/auth'

const loadAuthenticatedApp = () => import('./Authenticated-app')
const AuthenticatedApp = React.lazy(loadAuthenticatedApp)
const UnauthenticatedApp = React.lazy(() => import('./Unauthenticated-app'))

export default function App() {
	// const user = useUser()
	
	// pre-load the authenticated side in the background while the user's
  // filling out the login form.
  React.useEffect(() => {
    loadAuthenticatedApp()
	}, [])
	
  const user = true
  return (
		<Suspense fallback={<div>Loading...</div>}>
			{user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
		</Suspense>
	)
}
