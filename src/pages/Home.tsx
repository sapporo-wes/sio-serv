import { Box, Container } from "@mui/material"
import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <h1>Home</h1>
      </Container>
      <AppFooter />
    </Box>
  )
}
