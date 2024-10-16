import { Box, Container, Typography } from "@mui/material"
import { useEffect } from "react"
import { useAuth } from "react-oidc-context"

export default function SilentRenewCallback() {
  const auth = useAuth()
  console.log("SilentRenewCallback Component")

  useEffect(() => {
    console.log("SilentRenewCallback useEffect")
    auth.signinSilent().catch((error) => {
      console.error("Silent renew failed", error)
    })
  }, [auth])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Box sx={{ margin: "1.5rem 0" }}>
          <Typography children="Refreshing session..." />
        </Box>
      </Container>
    </Box>
  )
}
