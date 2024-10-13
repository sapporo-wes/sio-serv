import { Box, Container, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useErrorBoundary } from "react-error-boundary"

import AppFooter from "@/components/AppFooter"
import AppHeaderBase from "@/components/AppHeaderBase"
import { getServiceInfo } from "@/lib/spr"

interface DependencyCheckerProps {
  children: React.ReactNode
}

export default function DependencyChecker({ children }: DependencyCheckerProps) {
  const { showBoundary } = useErrorBoundary()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServiceInfo().then(() => {
      setLoading(false)
    }, (e) => {
      const newError = new Error(`Sapporo service is not available: ${e.message}`)
      newError.stack = e.stack
      showBoundary(newError)
    })
  }, [showBoundary])

  return (
    <>
      {loading ?
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <AppHeaderBase />
          <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
            <Box sx={{ margin: "1.5rem 0" }}>
              <Typography children="Loading..." />
            </Box>
          </Container>
          <AppFooter />
        </Box >
        : children
      }
    </>
  )
}
