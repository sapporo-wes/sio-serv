import { Typography, AppBar, Box } from "@mui/material"
import { SxProps } from "@mui/system"
import { Link } from "react-router-dom"

export interface AppHeaderBaseProps {
  sx?: SxProps
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export default function AppHeaderBase({ sx, leftContent, rightContent }: AppHeaderBaseProps) {
  return (
    <AppBar position="static" sx={{
      ...sx,
      boxShadow: "none",
      height: "64px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      bgcolor: "primary.dark",
    }}>
      <Box sx={{ ml: "1.5rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            component="div"
            sx={{
              fontSize: "1.75rem",
              letterSpacing: "0.25rem",
              mb: "0.25rem",
            }}
            children="sio-serv"
          />
        </Link>
        {leftContent}
      </Box>
      <Box sx={{ mr: "1.5rem" }}>
        {rightContent}
      </Box>
    </AppBar >
  )
}
