import { InfoOutlined } from "@mui/icons-material"
import { Box, Typography, Link } from "@mui/material"
import { SxProps } from "@mui/system"
import { useRecoilValue } from "recoil"

import CodeBlock from "@/components/CodeBlock"
import { runRequestFileAtom } from "@/store/configs"
import { SprRunRequestFile } from "@/types/configs"

export interface OverviewSecProps {
  sx?: SxProps
}

const ROW_HEIGHT = "2rem"
const HEADER_COL_WIDTH = "12rem"

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

export default function OverviewSec({ sx }: OverviewSecProps) {
  const runRequestFile = useRecoilValue(runRequestFileAtom)

  return (
    <Box sx={{ ...sx }} >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <InfoOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
        <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Workflow & Run Config Overview" />
      </Box>

      <Box sx={{ display: "flex", "flexDirection": "column", margin: "1rem 1.5rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Workflow URL */}
          <Box sx={{ display: "flex", flexDirection: "row", minHeight: ROW_HEIGHT, alignItems: "center" }}>
            <Typography children="Workflow URL:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
            <Link href={runRequestFile.workflow_url} target="_blank" children={runRequestFile.workflow_url} underline="hover" />
          </Box>

          {/* Workflow Type */}
          <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
            <Typography children="Workflow Type:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
            <Typography sx={{ fontFamily: "monospace", fontSize: "1.1rem" }} children={runRequestFile.workflow_type} />
          </Box>

          {/* Workflow Type Version */}
          {hasValue(runRequestFile, "workflow_type_version") && (
            <Box sx={{ display: "flex", flexDirection: "row", minHeight: ROW_HEIGHT, alignItems: "center" }}>
              <Typography children="Workflow Type Ver.:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
              <Typography sx={{ fontFamily: "monospace", fontSize: "1.1rem" }} children={runRequestFile.workflow_type_version} />
            </Box>
          )}

          {/* Workflow Engine */}
          <Box sx={{ display: "flex", flexDirection: "row", height: ROW_HEIGHT, alignItems: "center" }}>
            <Typography children="Workflow Engine:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
            <Typography sx={{ fontFamily: "monospace", fontSize: "1.1rem" }} children={runRequestFile.workflow_engine} />
          </Box>

          {/* Workflow Type Engine Version */}
          {hasValue(runRequestFile, "workflow_engine_version") && (
            <Box sx={{ display: "flex", flexDirection: "row", minHeight: ROW_HEIGHT, alignItems: "center" }}>
              <Typography children="Workflow Engine Ver.:" sx={{ fontWeight: "bold", minWidth: HEADER_COL_WIDTH, letterSpacing: "0.05rem" }} />
              <Typography sx={{ fontFamily: "monospace", fontSize: "1.1rem" }} children={runRequestFile.workflow_engine_version} />
            </Box>
          )}

          {/* Workflow Engine Parameters */}
          {hasValue(runRequestFile, "workflow_engine_parameters") && (
            <Box sx={{ mt: "0.25rem" }}>
              <Typography children="Workflow Engine Params:" sx={{ fontWeight: "bold", letterSpacing: "0.05rem", mb: "0.5rem" }} />
              <CodeBlock codeString={JSON.stringify(runRequestFile.workflow_engine_parameters, null, 2)} language="json" />
            </Box>
          )}

          {/* Workflow Attachment */}
          {hasValue(runRequestFile, "workflow_attachment_obj") && (
            <Box sx={{ mt: "0.25rem" }}>
              <Typography children="Workflow Attachment:" sx={{ fontWeight: "bold", letterSpacing: "0.05rem", mb: "0.5rem" }} />
              <CodeBlock codeString={JSON.stringify(runRequestFile.workflow_attachment_obj, null, 2)} language="json" />
            </Box>
          )}

          {/* Tags */}
          {hasValue(runRequestFile, "tags") && (
            <Box sx={{ mt: "0.25rem" }}>
              <Typography children="Tags:" sx={{ fontWeight: "bold", letterSpacing: "0.05rem", mb: "0.5rem" }} />
              <CodeBlock codeString={JSON.stringify(runRequestFile.tags, null, 2)} language="json" />
            </Box>
          )}
        </Box>
      </Box>
    </Box >
  )
}
