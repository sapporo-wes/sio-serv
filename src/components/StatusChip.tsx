import { Chip, colors } from "@mui/material"
import { SxProps } from "@mui/system"

import { hexToRgba } from "@/theme"
import { State } from "@/types/spr"

interface StatusChipProps {
  sx?: SxProps
  state: State
}

const toLabel = (str: string): string => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const getStatusChipColor = (state: State) => {
  if (state === "QUEUED") {
    return { label: toLabel(state), color: hexToRgba(colors.purple[400], 0.8) }
  }
  if (["INITIALIZING", "RUNNING", "PAUSED"].includes(state)) {
    return { label: toLabel(state), color: hexToRgba(colors.blue[400], 0.9) }
  }
  if (state === "COMPLETE") {
    return { label: toLabel(state), color: hexToRgba(colors.green[500], 0.8) }
  }
  if (["EXECUTOR_ERROR", "SYSTEM_ERROR"].includes(state)) {
    return { label: toLabel(state), color: hexToRgba(colors.red[400], 0.8) }
  }
  if (["CANCELED", "CANCELING", "PREEMPTED"].includes(state)) {
    return { label: toLabel(state), color: hexToRgba(colors.orange[500], 0.9) }
  }
  if (["DELETED", "DELETING"].includes(state)) {
    return { label: toLabel(state), color: hexToRgba(colors.grey[500], 0.9) }
  }

  return { label: "Unknown", color: hexToRgba(colors.grey[500], 0.8) }
}

export default function StatusChip({ sx, state }: StatusChipProps) {
  const { label, color } = getStatusChipColor(state)

  return (
    <Chip
      sx={{ ...sx, color: "white", backgroundColor: color, fontSize: "1rem" }}
      label={label}
    />
  )
}
