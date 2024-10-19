import { Box, Container, Typography } from "@mui/material"

import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"

export default function NotFound() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Box sx={{ margin: "1.5rem 0" }}>
          <Typography children="Page Not Found" />
        </Box>
      </Container>
      <AppFooter />
    </Box>
  )
}
