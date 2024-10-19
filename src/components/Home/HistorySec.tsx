import { EventNoteOutlined, FileUploadOutlined, ReplayOutlined } from "@mui/icons-material"
import { Box, TableContainer, Typography, Paper, Table, TableCell, TableHead, TableRow, TableBody, TablePagination, TableSortLabel, Button, Checkbox, FormControlLabel } from "@mui/material"
import { SxProps } from "@mui/system"
import { useEffect, useMemo, useRef, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useAuth } from "react-oidc-context"
import { Link } from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil"

import StatusChip from "@/components/StatusChip"
import { getAllRuns } from "@/lib/spr"
import { showBatchRunsOnlyAtom, batchRunIdsAtom, uploadedBatchFileAtom } from "@/store/wfExec"
import theme from "@/theme"
import { RunSummary } from "@/types/spr"

export interface HistorySecProps {
  sx?: SxProps
}

const shortenUUID = (uuid: string): string => {
  // return uuid.slice(0, 13) + "..."
  return uuid
}

const toDate = (utcTime: string) => {
  const utcTimeWithZ = utcTime.endsWith("Z") ? utcTime : utcTime + "Z"
  return new Date(utcTimeWithZ)
}

const utcTimeToLocal = (utcTime: string) => {
  const date = toDate(utcTime)
  const formattedDate = date.toLocaleString()
  return formattedDate
}

const nothingValue = (value: string | undefined | null): boolean => {
  return value === "" || value === undefined || value === null
}

export default function HistorySec({ sx }: HistorySecProps) {
  const auth = useAuth()
  const { showBoundary } = useErrorBoundary()
  const [runs, setRuns] = useState<RunSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showBatchRunsOnly, setShowBatchRunsOnly] = useRecoilState(showBatchRunsOnlyAtom)
  const [batchRunIds, setBatchRunIds] = useRecoilState(batchRunIdsAtom)
  const setUploadedBatchFile = useSetRecoilState(uploadedBatchFileAtom)

  // Import Batch Runs
  const [uploadError, setUploadError] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleImportButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const rows = (reader.result as string).split("\n").filter(row => row.trim() !== "")
          const headers = rows[0].split(",")
          if (headers[0] !== "\"Run ID\"") {
            setUploadError(true)
            setTimeout(() => setUploadError(false), 5000)
            return
          }
          const importedBatchRunIds = rows.slice(1).map(row => row.split(",")[0])
          setBatchRunIds(importedBatchRunIds)
          setUploadedBatchFile([])
          setShowBatchRunsOnly(true)
        } catch (e) {
          console.error(e)
          setUploadError(true)
          setTimeout(() => setUploadError(false), 5000)
        }
      }
      reader.readAsText(file)
    }
  }

  // Paging
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Sort
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [orderBy, setOrderBy] = useState<"Start Time" | "End Time">("Start Time")
  const handleSort = (property: "Start Time" | "End Time") => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const runs = await getAllRuns(auth.user!.access_token)
      setRuns(runs)
      setLoading(false)
    } catch (e) {
      showBoundary(e)
    }
  }

  useEffect(() => {
    if (auth.isAuthenticated)
      fetchData()
  }, [auth.isAuthenticated, auth.user, batchRunIds]) // eslint-disable-line react-hooks/exhaustive-deps

  const visibleRows = useMemo(() => {
    const filteredRuns = showBatchRunsOnly ? runs.filter(run => batchRunIds.includes(run.run_id)) : runs
    const sortedRuns = [...filteredRuns].sort((a, b) => {
      const dateA = orderBy === "Start Time" ? a.start_time : a.end_time
      const dateB = orderBy === "Start Time" ? b.start_time : b.end_time
      if (nothingValue(dateA) && nothingValue(dateB)) return 0
      if (nothingValue(dateA)) return 1
      if (nothingValue(dateB)) return -1
      const compareValue = toDate(dateA!).getTime() - toDate(dateB!).getTime()
      return order === "asc" ? compareValue : -compareValue
    })
    return sortedRuns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [runs, page, rowsPerPage, order, orderBy, showBatchRunsOnly, batchRunIds])

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EventNoteOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
          <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Run History" />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", mr: "1.5rem" }}>
          <FormControlLabel
            control={<Checkbox
              checked={showBatchRunsOnly}
              onChange={() => setShowBatchRunsOnly(!showBatchRunsOnly)}
            />}
            label="Show Batch Runs Only"
            sx={{ fontSize: "0.8rem", color: theme.palette.grey[700] }}
          />
          <Button
            sx={{ textTransform: "none", width: "12rem", mr: "1rem" }}
            variant="outlined"
            startIcon={<FileUploadOutlined />}
            children={
              uploadError ?
                "Failed to Import" :
                "Import Batch Runs"
            }
            color={uploadError ? "secondary" : "primary"}
            onClick={handleImportButtonClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            children="Reload"
            sx={{ textTransform: "none" }}
            variant="outlined"
            startIcon={<ReplayOutlined />}
            onClick={fetchData}
          />
        </Box>
      </Box>
      <Box sx={{ margin: "1.5rem" }}>
        {
          !auth.isAuthenticated ? (
            <Typography children="Please login to view run history." />
          ) : loading ? (
            <Typography children="Loading..." />
          ) : (
            // main content
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Table */}
              <TableContainer
                component={Paper}
                sx={{
                  border: `1px solid ${theme.palette.grey[500]}`,
                  boxShadow: "none",
                }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Run ID", "Status", "Start Time", "End Time"].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            borderBottom: visibleRows.length > 0 ? `1px solid ${theme.palette.grey[500]}` : "none",
                            fontWeight: "bold",
                          }}
                          align={["Status", "Start Time", "End Time"].includes(header) ? "center" : "left"}
                        >
                          {(["Start Time", "End Time"].includes(header)) ? (
                            <TableSortLabel
                              active={orderBy === header}
                              direction={orderBy === header ? order : "asc"}
                              onClick={() => handleSort(header as "Start Time" | "End Time")}
                              children={header}
                            />
                          ) : (
                            header
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.map((run) => (
                      <TableRow key={run.run_id}>
                        <TableCell>
                          <Link to={`/runs/${run.run_id}`} style={{ textDecoration: "none" }}>
                            <Typography
                              children={shortenUUID(run.run_id)}
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "1.1rem",
                                color: theme.palette.primary.main,
                                "&:hover": { textDecoration: "underline" },
                              }} />
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          <StatusChip state={run.state ?? "UNKNOWN"} />
                        </TableCell>
                        <TableCell align="center">
                          {run.start_time &&
                            <Typography children={utcTimeToLocal(run.start_time)} />
                          }
                        </TableCell>
                        <TableCell align="center">
                          {run.end_time &&
                            <Typography children={utcTimeToLocal(run.end_time)} />
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50]}
                  count={showBatchRunsOnly ? batchRunIds.length : runs.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{ border: "none" }}
                  component="div"
                />
              </Box>
            </Box>
          )
        }
      </Box>
    </Box >
  )
}
