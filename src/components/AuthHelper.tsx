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
  const currentPath = window.location.pathname

  // For redirecting to the current path after signin used in AuthCallback.tsx
  if (!auth.isAuthenticated && currentPath !== `${import.meta.env.BASE_URL}auth/callback`) {
    localStorage.setItem("sio-serv.auth.currentPath", currentPath)
  }

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
  }, [auth, hasTriedSignin])

  // Automatic renew token
  useEffect(() => {
    const handleTokenExpiring = () => {
      auth.signinSilent()
    }

    auth.events.addAccessTokenExpiring(handleTokenExpiring)

    return () => {
      auth.events.removeAccessTokenExpiring(handleTokenExpiring)
    }
  })

  return <>{children}</>
}
