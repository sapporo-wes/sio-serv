import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

export interface AppFooterProps {
  sx?: SxProps
}

export default function AppFooter({ sx }: AppFooterProps) {
  return (
    <Box component="footer" sx={{ ...sx, margin: "1.5rem 0" }}>
      <Typography variant="body2" align="center" color="text.secondary"
        children={`© 2003-${new Date().getFullYear()} Graduate School of Medicine and School of Medicine, Chiba University.`}
      />
      <Typography variant="body2" align="center" color="text.secondary" sx={{ letterSpacing: "0.1rem" }}
        children={`sio-serv ${__APP_VERSION__}`}
      />
    </Box>
  )
}
