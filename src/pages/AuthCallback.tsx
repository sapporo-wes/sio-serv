import { Box, Container, Typography } from "@mui/material"
import { useEffect } from "react"
import { useAuth } from "react-oidc-context"
import { useNavigate } from "react-router-dom"

import AppFooter from "@/components/AppFooter"
import AppHeaderBase from "@/components/AppHeaderBase"

export default function AuthCallback() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      const prevPath = localStorage.getItem("sio-serv.auth.currentPath") || "/"
      navigate(prevPath)
    }
  }, [auth.isAuthenticated, navigate])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeaderBase />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Typography sx={{ mt: "1.5rem" }}>Authenticating...</Typography>
      </Container>
      <AppFooter />
    </Box>

  )
}
