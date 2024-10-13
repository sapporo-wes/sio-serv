import { Chip, colors } from "@mui/material"
import { SxProps } from "@mui/system"

import theme from "@/theme"
import { State } from "@/types/spr"

interface StateChipProps {
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

const getStateChipColor = (state: State) => {
  if (state === "QUEUED") {
    return { label: toLabel(state), color: colors.purple[400] }
  }
  if (["INITIALIZING", "RUNNING", "PAUSED"].includes(state)) {
    return { label: toLabel(state), color: colors.blue[400] }
  }
  if (state === "COMPLETE") {
    return { label: toLabel(state), color: colors.green[500] }
  }
  if (["EXECUTOR_ERROR", "SYSTEM_ERROR"].includes(state)) {
    return { label: toLabel(state), color: colors.red[400] }
  }
  if (["CANCELED", "CANCELING", "PREEMPTED"].includes(state)) {
    return { label: toLabel(state), color: colors.orange[500] }
  }
  if (["DELETED", "DELETING"].includes(state)) {
    return { label: toLabel(state), color: theme.palette.grey[500] }
  }

  return { label: "Unknown", color: theme.palette.grey[500] }
}

export default function StateChip({ sx, state }: StateChipProps) {
  const { label, color } = getStateChipColor(state)

  return (
    <Chip
      sx={{ ...sx, color: "white", backgroundColor: color, fontSize: "1rem" }}
      label={label}
    />
  )
}
