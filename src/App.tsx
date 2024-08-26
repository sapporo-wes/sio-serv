import AppHeader from "@/components/AppHeader"
import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { RecoilRoot } from "recoil"

const themeConfig = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={themeConfig}>
        <CssBaseline />
        <RecoilRoot>
          <Routes>
            <Route path="/" element={<AppHeader />} />
          </Routes>
        </RecoilRoot>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
