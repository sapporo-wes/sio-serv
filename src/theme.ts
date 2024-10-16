import { colors } from "@mui/material"
import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
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

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default theme
