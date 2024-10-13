import { Box, Container, Divider, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useAuth } from "react-oidc-context"
import { useParams } from "react-router-dom"

import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import InfoSec from "@/components/RunDetail/InfoSec"
import ResultSec from "@/components/RunDetail/ResultSec"
import { getRun } from "@/lib/spr"
import { RunLog } from "@/types/spr"

export default function RunDetail() {
  const auth = useAuth()
  const { showBoundary } = useErrorBoundary()
  const runId = useParams<{ runId: string }>().runId!
  const [run, setRun] = useState<RunLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [runNotFound, setRunNotFound] = useState(false)

  useEffect(() => {
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

    if (!auth.isLoading && auth.isAuthenticated) {
      fetchRun()
    }
  }, [auth, runId, showBoundary])

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
      return <Typography children={`Run ${runId} not found.`} />
    }
    return (
      <>
        <InfoSec run={run!} />
        <Divider />
        <ResultSec run={run!} />
      </>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Box sx={{ margin: "1.5rem 0" }}>
          {mainContent()}
        </Box>
      </Container>
      <AppFooter />
    </Box >
  )
}
