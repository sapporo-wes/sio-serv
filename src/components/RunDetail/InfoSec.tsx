import { Box } from "@mui/material"
import { SxProps } from "@mui/system"

import { RunLog } from "@/types/spr"

export interface InfoSecProps {
  sx?: SxProps
  run: RunLog
}

export default function InfoSec({ sx, run }: InfoSecProps) {
  return (
    <Box sx={{ ...sx }}>
      {/* {JSON.stringify(run, null, 2)} */}
      InfoSec
    </Box>
  )
}
