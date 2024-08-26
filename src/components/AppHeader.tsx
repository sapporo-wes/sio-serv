import { Typography, AppBar, Button, Box } from "@mui/material"
import { SxProps } from "@mui/system"

export interface AppHeaderProps {
  sx?: SxProps
}

export default function AppHeader({ sx }: AppHeaderProps) {
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
        <Typography
          component="div"
          sx={{
            fontSize: "1.75rem",
            letterSpacing: "0.25rem",
            mb: "0.25rem",
          }}
          children="sio-serv"
        />
      </Box>
      <Box sx={{ mr: "1.5rem" }}>
        <Button
          variant="outlined"
          sx={{ color: "white", textTransform: "none", border: "1px solid white" }}
          children="Sign In"
        />
      </Box>
    </AppBar >
  )
}
