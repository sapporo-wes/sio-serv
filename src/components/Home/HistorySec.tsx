import { EventNoteOutlined } from "@mui/icons-material"
import { Box, TableContainer, Typography, Paper, Table, TableCell, TableHead, TableRow, TableBody, TablePagination, TableSortLabel } from "@mui/material"
import { SxProps } from "@mui/system"
import { useEffect, useMemo, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useAuth } from "react-oidc-context"
import { Link } from "react-router-dom"

import StateChip from "@/components/StateChip"
import { getAllRuns } from "@/lib/spr"
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const runs = await getAllRuns(auth.user!.access_token)
        setRuns(runs)
        setLoading(false)
      } catch (e) {
        showBoundary(e)
      }
    }

    if (auth.isAuthenticated && loading)
      fetchData()
  }, [auth.isAuthenticated, auth.user, loading, showBoundary])

  const visibleRows = useMemo(() => {
    const sortedRuns = [...runs].sort((a, b) => {
      const dateA = orderBy === "Start Time" ? a.start_time : a.end_time
      const dateB = orderBy === "Start Time" ? b.start_time : b.end_time
      if (nothingValue(dateA) && nothingValue(dateB)) return 0
      if (nothingValue(dateA)) return 1
      if (nothingValue(dateB)) return -1
      const compareValue = toDate(dateA!).getTime() - toDate(dateB!).getTime()
      return order === "asc" ? compareValue : -compareValue
    })
    return sortedRuns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [runs, page, rowsPerPage, order, orderBy])

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <EventNoteOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
        <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Job History" />
      </Box>
      <Box sx={{ margin: "1.5rem" }}>
        {
          !auth.isAuthenticated ? (
            <Typography children="Please login to view job history" />
          ) : loading ? (
            <Typography children="Loading..." />
          ) : (
            // main content
            <Box>
              <TableContainer
                component={Paper}
                sx={{
                  border: `1px solid ${theme.palette.grey[500]}`,
                  boxShadow: "none",
                }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Run ID", "State", "Start Time", "End Time"].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            borderBottom: visibleRows.length > 0 ? `1px solid ${theme.palette.grey[500]}` : "none",
                            fontWeight: "bold",
                          }}
                          align={["State", "Start Time", "End Time"].includes(header) ? "center" : "left"}
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
                          <Link to={`/jobs/${run.run_id}`} style={{ textDecoration: "none" }}>
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
                          <StateChip state={run.state ?? "UNKNOWN"} />
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
                  count={runs.length}
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
