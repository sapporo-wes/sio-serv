import { Box, Container, Divider } from "@mui/material"

import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import HistorySec from "@/components/Home/HistorySec"
import OverviewSec from "@/components/Home/OverviewSec"
import SingleRunSec from "@/components/Home/SingleRunSec"

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <OverviewSec sx={{ margin: "1.5rem 0" }} />
        <Divider />
        <SingleRunSec sx={{ margin: "1.5rem 0" }} />
        <Divider />
        <HistorySec sx={{ margin: "1.5rem 0" }} />
      </Container>
      <AppFooter />
    </Box >
  )
}
