import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { RecoilRoot } from "recoil"
import Home from "@/pages/Home"
import { colors } from "@mui/material"

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
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </RecoilRoot>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
