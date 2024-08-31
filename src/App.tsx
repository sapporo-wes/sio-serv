import { AuthProvider } from "react-oidc-context"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CssBaseline } from "@mui/material"
import { ErrorBoundary } from "react-error-boundary"
import { oidcConfig } from "@/auth"
import { RecoilRoot } from "recoil"
import { ThemeProvider } from "@mui/material/styles"
import AuthCallback from "@/pages/AuthCallback"
import AuthHelper from "@/components/AuthHelper"
import ErrorFallback from "@/pages/ErrorFallback"
import Home from "@/pages/Home"
import theme from "@/theme"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
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
