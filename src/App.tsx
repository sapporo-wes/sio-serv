import { AuthProvider } from "react-oidc-context"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { colors } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { ErrorBoundary } from "react-error-boundary"
import { oidcConfig } from "@/auth"
import { RecoilRoot } from "recoil"
import AuthCallback from "@/pages/AuthCallback"
import AuthHelper from "@/components/AuthHelper"
import ErrorFallback from "@/pages/ErrorFallback"
import Home from "@/pages/Home"

const themeConfig = createTheme({
  palette: {
    primary: {
      main: colors.indigo[400],
    },
    secondary: {
      main: colors.red[400],
    },
    text: {
      primary: colors.grey[900],
      secondary: colors.grey[600],
    },
  },
})

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={themeConfig}>
        <CssBaseline />
        <RecoilRoot>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AuthProvider {...oidcConfig}>
              <AuthHelper>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
              </AuthHelper>
            </AuthProvider>
          </ErrorBoundary>
        </RecoilRoot>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
