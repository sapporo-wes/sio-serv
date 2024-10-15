import { AssignmentOutlined, ReplayOutlined, CancelOutlined, DeleteOutlined } from "@mui/icons-material"
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, colors } from "@mui/material"
import { SxProps } from "@mui/system"
import { useState } from "react"

import StatusChip from "@/components/StatusChip"
import { RunLog } from "@/types/spr"

export interface InfoSecProps {
  sx?: SxProps
  run: RunLog
  reloadRun: () => void
}

const ROW_HEIGHT = "2rem"
const HEADER_COL_WIDTH = "7rem"

const RUNNING_STATES = ["QUEUED", "INITIALIZING", "RUNNING", "PAUSED"]
const isRunning = (state: string) => RUNNING_STATES.includes(state)

const utcTimeToLocal = (utcTime: string) => {
  const utcTimeWithZ = utcTime.endsWith("Z") ? utcTime : utcTime + "Z"
  const date = new Date(utcTimeWithZ)
  const formattedDate = date.toLocaleString(undefined, { timeZoneName: "short" })
  const formattedWithZoneInBrackets = formattedDate.replace(/(\w+)$/, "($1)")
  return formattedWithZoneInBrackets
}

export default function InfoSec({ sx, run, reloadRun }: InfoSecProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const handleDialogConfirm = (isCancel: boolean) => { // cancel or delete run
    // TODO: Implement cancel/delete run
  }

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AssignmentOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
          <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Run Results" />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", flexDirection: "row" }} >
          <Button
            children="Reload"
            sx={{ textTransform: "none", mr: "1rem" }}
            variant="outlined"
            startIcon={<ReplayOutlined />}
            onClick={reloadRun}
          />
          <Button
            children={
              isRunning(run.state ?? "UNKNOWN") ?
                "Cancel This Run" :
                "Delete This Run"
            }
            sx={{ textTransform: "none" }}
            variant="contained"
            startIcon={
              isRunning(run.state ?? "UNKNOWN") ?
                <CancelOutlined /> :
                <DeleteOutlined />
            }
            onClick={() => setDialogOpen(true)}
            disabled={["DELETED", "DELETING"].includes(run.state ?? "UNKNOWN")}
          />
        </Box>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {isRunning(run.state ?? "UNKNOWN") ?
              <>
                <CancelOutlined sx={{ fontSize: "1.4rem", mr: "0.3rem" }} />
                <Typography children="Cancel This Run" sx={{ fontSize: "1.2rem" }} />
              </>
              :
              <>
                <DeleteOutlined sx={{ fontSize: "1.4rem", mr: "0.3rem" }} />
                <Typography children="Delete This Run" sx={{ fontSize: "1.2rem" }} />
              </>
            }
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isRunning(run.state ?? "UNKNOWN") ?
              "Are you sure you want to stop the running process for " :
              "Are you sure you want to permanently delete the run "
            }
            <Box
              component="span"
              sx={{
                fontFamily: "monospace",
                fontSize: "1.1rem",
              }}
            >
              {run.run_id ?? ""}
            </Box>
            {isRunning(run.state ?? "UNKNOWN") ?
              "?" :
              "? This action cannot be undone."
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ mb: "0.5rem", mr: "1rem" }}>
          <Button children="Cancel" onClick={() => setDialogOpen(false)} variant="outlined" sx={{
            color: colors.grey[500],
            borderColor: colors.grey[500],
            textTransform: "none",
            "&:hover": {
              borderColor: colors.grey[700],
              backgroundColor: colors.grey[200],
            },
          }} />
          <Button
            children="Confirm"
            onClick={() => handleDialogConfirm(isRunning(run.state ?? "UNKNOWN"))}
            sx={{ textTransform: "none" }}
            variant="contained"
            color="primary"
          />
        </DialogActions>
      </Dialog>

      {/* Listing */}
      <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem 1.5rem 0.5rem", gap: "0.75rem" }}>
        {/* Run ID */}
        <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
          <Typography sx={{ width: HEADER_COL_WIDTH, fontWeight: "bold", letterSpacing: "0.05rem" }} children="Run ID:" />
          <Typography sx={{ fontFamily: "monospace", fontSize: "1.1rem" }} children={run.run_id ?? ""} />
        </Box>

        {/* State */}
        <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
          <Typography sx={{ width: HEADER_COL_WIDTH, fontWeight: "bold", letterSpacing: "0.05rem" }} children="Status:" />
          <StatusChip state={run.state ?? "UNKNOWN"} />
        </Box>

        {/* Started */}
        <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
          <Typography sx={{ width: HEADER_COL_WIDTH, fontWeight: "bold", letterSpacing: "0.05rem" }} children="Start Time:" />
          {run.run_log?.start_time &&
            <Typography children={utcTimeToLocal(run.run_log?.start_time)} />
          }
        </Box>

        {/* Finished */}
        <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
          <Typography sx={{ width: HEADER_COL_WIDTH, fontWeight: "bold", letterSpacing: "0.05rem" }} children="End Time:" />
          {run.run_log?.end_time &&
            <Typography children={utcTimeToLocal(run.run_log?.end_time)} />
          }
        </Box>
      </Box>
    </Box>
  )
}
