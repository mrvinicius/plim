import React, { Suspense } from 'react'
// import {useUser} from './context/auth'

const AuthenticatedApp = React.lazy(() => import('./Authenticated-app'))
const UnauthenticatedApp = React.lazy(() => import('./Unauthenticated-app'))

export default function App() {
  // const user = useUser()
  const user = true
  return (
		<Suspense fallback={<div>Loading...</div>}>
			{user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
		</Suspense>
	)
}
