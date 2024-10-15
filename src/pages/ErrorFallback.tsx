import { Box, Typography, Paper, Container, Button } from "@mui/material"

import AppFooter from "@/components/AppFooter"
import AppHeaderBase from "@/components/AppHeaderBase"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeaderBase />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Typography sx={{ mt: "1.5rem", mb: "0.5rem", fontSize: "2rem" }} children="Unexpected Error" />
        <Typography>
          {"An unexpected error has occurred. Please provide the following details to the developers."}<br />
          {"Clicking the retry button will reset the application state and reload the content."}
        </Typography>
        <Box sx={{ margin: "1.5rem 0" }}>
          <Typography sx={{ fontWeight: "bold", marginBottom: "0.5rem" }} children="Error Message" />
          <Paper variant="outlined" sx={{ padding: "0.5rem 1rem" }}>
            <Box sx={{ fontFamily: "monospace", overflowX: "auto" }}>
              <pre>{error.message}</pre>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ margin: "1.5rem 0" }}>
          <Typography sx={{ fontWeight: "bold", marginBottom: "0.5rem" }} children="Stack Trace" />
          <Paper variant="outlined" sx={{ padding: "0.5rem 1rem" }}>
            <Box sx={{ fontFamily: "monospace", overflowX: "auto" }}>
              <pre>{error.stack}</pre>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ margin: "1.5rem 0" }}>
          <Button variant="contained" color="primary" onClick={resetErrorBoundary} children="Retry" sx={{ textTransform: "none" }} />
        </Box>
      </Container>
      <AppFooter />
    </Box>
  )
}
