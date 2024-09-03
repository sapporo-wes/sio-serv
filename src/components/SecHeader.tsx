import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

export interface SecHeaderProps {
  title: string
  sx?: SxProps
}

export default function SecHeader({ title, sx }: SecHeaderProps) {
  return (
    <Box sx={sx}>
      <Typography variant="h2" sx={{ fontSize: "2rem" }} children={title} />
    </Box>
  )
}
