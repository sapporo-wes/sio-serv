import { useEffect, useState } from "react"
import { useAuth, hasAuthParams } from "react-oidc-context"

interface AutomaticSignInProps {
  children: React.ReactNode
}

const isTokenExpired = (exp: number) => {
  return Date.now() >= exp * 1000
}

export default function AuthHelper({ children }: AutomaticSignInProps) {
  const auth = useAuth()
  const [hasTriedSignin, setHasTriedSignin] = useState(false)

  // For redirecting to the current path after signin used in AuthCallback.tsx
  useEffect(() => {
    const currentPath = window.location.pathname
    if (!auth.isAuthenticated && currentPath !== `${import.meta.env.BASE_URL}auth/callback`) {
      localStorage.setItem("sio-serv.auth.currentPath", currentPath)
    }
  }, [auth.isAuthenticated])

  // Automatic signin
  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      !hasTriedSignin &&
      !isTokenExpired(auth.user?.expires_at ?? 0)
    ) {
      auth.signinSilent()
      setHasTriedSignin(true)
    }

    if (auth.isAuthenticated) {
      setHasTriedSignin(false) // Reset after successful signin
    }
  }, [auth, hasTriedSignin])

  // Automatic renew token
  useEffect(() => {
    const refreshTokenBeforeExpiry = () => {
      if (auth.user?.expires_at) {
        const expirationTime = auth.user.expires_at * 1000 - Date.now()
        const refreshTime = expirationTime - 1000 * 60 // 1 minutes before expiration
        if (refreshTime > 0) {
          const timeoutId = setTimeout(() => {
            auth.signinSilent()
          }, refreshTime)
          return () => clearTimeout(timeoutId)
        }
      }
    }

    if (auth.isAuthenticated) {
      refreshTokenBeforeExpiry()
    }
  }, [auth])

  return <>{children}</>
}
