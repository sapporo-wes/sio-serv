import { Box } from "@mui/material"
import { SxProps } from "@mui/system"

import { RunLog } from "@/types/spr"

export interface ResultSecProps {
  sx?: SxProps
  run: RunLog
}

export default function ResultSec({ sx, run }: ResultSecProps) {
  return (
    <Box sx={{ ...sx }}>
      {/* {JSON.stringify(run, null, 2)} */}
      ResultSec
    </Box>
  )
}
