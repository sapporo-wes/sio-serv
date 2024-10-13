import { InfoOutlined } from "@mui/icons-material"
import { Box, Typography, Link, Tabs, Tab } from "@mui/material"
import { SxProps } from "@mui/system"
import { useState } from "react"
import { useRecoilValue } from "recoil"

import CodeBlock from "@/components/CodeBlock"
import { runRequestFileAtom } from "@/store/configs"
import { SprRunRequestFile } from "@/types/configs"

export interface OverviewSecProps {
  sx?: SxProps
}

const ROW_HEIGHT = "2rem"
const HEADER_COL_WIDTH = "160px"

const hasExtraConfig = (runRequestFile: SprRunRequestFile) => {
  return hasValue(runRequestFile, "workflow_type_version") || hasValue(runRequestFile, "workflow_engine_version") || hasValue(runRequestFile, "workflow_engine_parameters") || hasValue(runRequestFile, "workflow_attachment_obj") || hasValue(runRequestFile, "tags")
}

const hasValue = (runRequestFile: SprRunRequestFile, key: string): boolean => {
  const value = (runRequestFile as any)[key] // eslint-disable-line @typescript-eslint/no-explicit-any

  if (value === undefined || value === null) {
    return false
  }
  if (typeof value === "string" && value.trim() === "") {
    return false
  }
  if (Array.isArray(value) && value.length === 0) {
    return false
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return false
  }

  return true
}

const createTabHeaders = (runRequestFile: SprRunRequestFile): string[] => {
  const tabs = []
  if (hasValue(runRequestFile, "workflow_type_version") || hasValue(runRequestFile, "workflow_engine_version")) {
    tabs.push("Other Cfg.")
  }
  if (hasValue(runRequestFile, "workflow_engine_parameters")) {
    tabs.push("Engine Params.")
  }
  if (hasValue(runRequestFile, "workflow_attachment_obj")) {
    tabs.push("Attachments")
  }
  if (hasValue(runRequestFile, "tags")) {
    tabs.push("Tags")
  }

  return tabs
}

// TODO: Remove this mock data
// const runRequestFile: SprRunRequestFile = {
//   workflow_type: "workflow_type",
//   workflow_type_version: "workflow_type_version",
//   workflow_engine: "workflow_engine",
//   workflow_engine_version: "workflow_engine_version",
//   workflow_engine_parameters: { key: "value" },
//   workflow_url: "workflow_url",
//   workflow_attachment_obj: [{ file_name: "file_name", file_url: "file_url" }],
//   tags: {
//     key: "value",
//   },
// }

export default function OverviewSec({ sx }: OverviewSecProps) {
  const runRequestFile = useRecoilValue(runRequestFileAtom)
  const tabHeaders = createTabHeaders(runRequestFile)
  const [tabIndex, setTabIndex] = useState(tabHeaders.length > 0 ? tabHeaders[0] : "")

  return (
    <Box sx={{ ...sx }} >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <InfoOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
        <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Workflow & Run Cfg. Overview" />
      </Box>

      <Box sx={{ display: "flex", "flexDirection": "column", margin: "1rem 1.5rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Workflow URL */}
          <Box sx={{ display: "flex", flexDirection: "row", minHeight: ROW_HEIGHT, alignItems: "center" }}>
            <Typography children="Workflow URL:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
            <Link href={runRequestFile.workflow_url} target="_blank" children={runRequestFile.workflow_url} sx={{ textDecoration: "none" }} />
          </Box>

          {/* Workflow Type */}
          <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
            <Typography children="Workflow Type:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
            <Typography children={runRequestFile.workflow_type} />
          </Box>

          {/* Workflow Engine */}
          <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
            <Typography children="Workflow Engine:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
            <Typography children={runRequestFile.workflow_engine} />
          </Box>
        </Box>

        {hasExtraConfig(runRequestFile) && (
          <Box sx={{ mt: "0.5rem" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} >
                {tabHeaders.map((header) => <Tab key={header} label={header} value={header} sx={{ textTransform: "none" }} />)}
              </Tabs>
            </Box>

            {tabIndex === "Other Cfg." && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem", mt: "1.5rem" }}>
                <Box sx={{ display: "flex", flexDirection: "row", minHeight: ROW_HEIGHT, alignItems: "center" }}>
                  <Typography children="Workflow Type Ver.:" sx={{ fontWeight: "bold", minWidth: "200px", letterSpacing: "0.05rem" }} />
                  <Typography children={runRequestFile.workflow_type_version} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", minHeight: ROW_HEIGHT, alignItems: "center" }}>
                  <Typography children="Workflow Engine Ver.:" sx={{ fontWeight: "bold", minWidth: "200px", letterSpacing: "0.05rem" }} />
                  <Typography children={runRequestFile.workflow_engine_version} />
                </Box>
              </Box>
            )}

            {tabIndex === "Engine Params." && (
              <CodeBlock codeString={JSON.stringify(runRequestFile.workflow_engine_parameters, null, 2)} language="json" sx={{ margin: "1.5rem 1.5rem 0" }} />
            )}

            {tabIndex === "Attachments" && (
              <Box>
                <CodeBlock codeString={JSON.stringify(runRequestFile.workflow_attachment_obj, null, 2)} language="json" sx={{ margin: "1.5rem 1.5rem 0" }} />
              </Box>
            )}

            {tabIndex === "Tags" && (
              <Box>
                <CodeBlock codeString={JSON.stringify(runRequestFile.tags, null, 2)} language="json" sx={{ margin: "1.5rem 1.5rem 0" }} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box >
  )
}
