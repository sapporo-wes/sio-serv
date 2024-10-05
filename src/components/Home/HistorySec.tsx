import { EventNoteOutlined } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

export interface HistorySecProps {
  sx?: SxProps
}

export default function HistorySec({ sx }: HistorySecProps) {
  return (
    <Box sx={{ ...sx, display: "flex", alignItems: "center" }}>
      <EventNoteOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
      <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Job History" />
    </Box>
  )
}
