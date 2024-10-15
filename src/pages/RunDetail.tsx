import { ArrowBackIosNewOutlined, DoorFrontOutlined } from "@mui/icons-material"
import { Box, Container, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useAuth } from "react-oidc-context"
import { useParams, Link } from "react-router-dom"

import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import InfoSec from "@/components/RunDetail/InfoSec"
import ResultSec from "@/components/RunDetail/ResultSec"
import { getRun } from "@/lib/spr"
import theme from "@/theme"
import { RunLog } from "@/types/spr"

export default function RunDetail() {
  const auth = useAuth()
  const { showBoundary } = useErrorBoundary()
  const runId = useParams<{ runId: string }>().runId!
  const [run, setRun] = useState<RunLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [runNotFound, setRunNotFound] = useState(false)

  const [tabIndex, setTabIndex] = useState(0)

  const fetchRun = async () => {
    setLoading(true)
    try {
      const run = await getRun(runId, auth.user!.access_token)
      setRun(run)
    } catch (e) {
      if (e instanceof Error && e.message.toLowerCase().includes("failed")) {
        setRunNotFound(true)
      } else {
        showBoundary(e)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      fetchRun()
    }
  }, [auth]) // eslint-disable-line react-hooks/exhaustive-deps

  const mainContent = () => {
    if (auth.isLoading) {
      return <Typography children="Loading..." />
    }
    if (!auth.isAuthenticated) {
      return <Typography children="You are not signed in. Please sign in to view the run." />
    }
    if (loading) {
      return <Typography children="Loading..." />
    }
    if (runNotFound) {
      return <Typography children={`Run ${runId} not found or you don't have permission to view it.`} />
    }
    return (
      <>
        <InfoSec run={run!} reloadRun={fetchRun} />
        <ResultSec run={run!} tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        {/* Back To Main Page */}
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", mt: "1rem" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: theme.palette.primary.main,
              fontSize: "0.9rem",
              "&:hover": { textDecoration: "underline" },
            }}>
              <ArrowBackIosNewOutlined sx={{ fontSize: "1rem" }} />
              <DoorFrontOutlined sx={{ fontSize: "1.5rem", mr: "0.4rem" }} />
              {"Back To Main Page"}
            </Typography>
          </Link>
        </Box>

        {/* Main Content */}
        <Box sx={{ margin: "1rem 0 1.5rem" }}>
          {mainContent()}
        </Box>
      </Container >
      <AppFooter />
    </Box >
  )
}
