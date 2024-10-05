import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { ErrorBoundary } from "react-error-boundary"
import { AuthProvider } from "react-oidc-context"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { RecoilRoot } from "recoil"

import { oidcConfig } from "@/auth"
import AuthHelper from "@/components/AuthHelper"
import AuthCallback from "@/pages/AuthCallback"
import ErrorFallback from "@/pages/ErrorFallback"
import Home from "@/pages/Home"
import RunDetail from "@/pages/RunDetail"
import theme from "@/theme"

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecoilRoot>
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <AuthProvider {...oidcConfig}>
              <AuthHelper>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/runs/:runId" element={<RunDetail />} />
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
