import { InfoOutlined, ListAltOutlined, RocketLaunchOutlined, EventNoteOutlined } from "@mui/icons-material"
import { Box, Container, Tabs, Tab } from "@mui/material"
import { useState } from "react"

import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import BatchRunsSec from "@/components/Home/BatchRunsSec"
import HistorySec from "@/components/Home/HistorySec"
import OverviewSec from "@/components/Home/OverviewSec"
import SingleRunSec from "@/components/Home/SingleRunSec"

<EventNoteOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />

const tabs: string[] = [
  "Overview",
  "Single Run",
  "Batch Runs",
  "History",
]

export default function Home() {
  const [tabIndex, setTabIndex] = useState(1)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: "0.5rem" }}>
          <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} >
            {tabs.map((tab) => (
              <Tab
                key={tab}
                label={tab}
                sx={{ textTransform: "none", minHeight: "3rem" }}
                icon={(() => {
                  if (tab === "Overview") return <InfoOutlined />
                  if (tab === "Single Run") return <RocketLaunchOutlined />
                  if (tab === "Batch Runs") return <ListAltOutlined />
                  if (tab === "History") return <EventNoteOutlined />
                })()}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {tabIndex === 0 && (<OverviewSec sx={{ margin: "1rem 0.5rem 1.5rem" }} />)}
        {tabIndex === 1 && (<SingleRunSec sx={{ margin: "1rem 0.5rem 1.5rem" }} />)}
        {tabIndex === 2 && (<BatchRunsSec setTabIndex={setTabIndex} sx={{ margin: "1rem 0.5rem 1.5rem" }} />)}
        {tabIndex === 3 && (<HistorySec sx={{ margin: "0.75rem 0.5rem 1.5rem" }} />)}
      </Container>
      <AppFooter />
    </Box >
  )
}
