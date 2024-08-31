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

export default theme
