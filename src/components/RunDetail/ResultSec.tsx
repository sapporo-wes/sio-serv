import { FileDownloadOutlined, RocketLaunchOutlined, EditOutlined, UndoOutlined } from "@mui/icons-material"
import { Box, Tabs, Tab, Typography, Link, Button, Divider } from "@mui/material"
import { SxProps } from "@mui/system"
import Form from "@rjsf/mui"
import validator from "@rjsf/validator-ajv8"
import { useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useAuth } from "react-oidc-context"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"

import CodeBlock from "@/components/CodeBlock"
import { convertToSchemaForForm } from "@/lib/configs"
import { jsonPathToNest, nestToJsonPath, postRuns } from "@/lib/spr"
import { uiTableAtom, runRequestFileAtom } from "@/store/configs"
import { FileObject, RunLog } from "@/types/spr"

export interface ResultSecProps {
  sx?: SxProps
  run: RunLog
  tabIndex: number
  setTabIndex: (index: number) => void
}

interface TabHeader {
  id: string
  tabName: string
}

const tabs: TabHeader[] = [
  {
    id: "result",
    tabName: "Result",
  },
  {
    id: "workflowParams",
    tabName: "Workflow Parameters",
  },
  {
    id: "logs",
    tabName: "Logs",
  },
]

const uiSchema = {
  "ui:submitButtonOptions": {
    norender: true,
  },
}

export default function ResultSec({ sx, run, tabIndex, setTabIndex }: ResultSecProps) {
  const auth = useAuth()
  const { showBoundary } = useErrorBoundary()
  const navigate = useNavigate()

  // Download file with authorization
  const downloadFile = (file: FileObject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", file.file_url, true)
    xhr.setRequestHeader("Authorization", `Bearer ${auth.user?.access_token}`)
    xhr.responseType = "blob"

    xhr.onload = () => {
      if (xhr.status === 200) {
        const url = window.URL.createObjectURL(xhr.response)
        const a = document.createElement("a")
        a.href = url
        a.download = file.file_name
        a.click() // TODO: Check large file download
        window.URL.revokeObjectURL(url)
      } else {
        showBoundary(new Error(`Failed to download file: ${file.file_name}: ${xhr.statusText}`))
      }
    }

    xhr.onerror = () => {
      showBoundary(new Error(`Failed to download file: ${file.file_name}: ${xhr.statusText}`))
    }

    xhr.send()
  }

  // Re-exec form
  const runRequestFile = useRecoilValue(runRequestFileAtom)
  const uiTable = useRecoilValue(uiTableAtom)
  const schemaForForm = convertToSchemaForForm(uiTable)
  const [wfParams, setWfParams] = useState(nestToJsonPath(run.request?.workflow_params as Record<string, unknown> ?? {}))
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [editParams, setEditParams] = useState(false)

  const execWf = async () => {
    setBtnDisabled(true)
    postRuns(runRequestFile, jsonPathToNest(wfParams), auth.user!.access_token).then((runId) => {
      setBtnDisabled(false)
      navigate(`/runs/${runId.run_id}`)
      window.scrollTo(0, 0)
      setTabIndex(0)
    }).catch((e) => {
      showBoundary(e)
    })
  }

  const handleEditParams = () => {
    if (editParams) {
      setWfParams(nestToJsonPath(run.request?.workflow_params as Record<string, unknown> ?? {}))
      setEditParams(false)
    } else {
      setEditParams(true)
    }
  }

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.tabName} sx={{ textTransform: "none" }} />
          ))}
        </Tabs>
      </Box>

      {/* Result */}
      {
        tabIndex === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem 1.5rem 1.5rem" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FileDownloadOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
              <Typography sx={{ fontSize: "1.4rem" }} children="Download Outputs" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem", margin: "0.5rem 1.5rem 0" }}>
              {(run.outputs ?? []).map((output, index) => (
                <Link
                  key={index}
                  href={output.file_url}
                  children={output.file_name}
                  underline="hover"
                  onClick={(e) => {
                    e.preventDefault()
                    downloadFile(output)
                  }}
                />
              ))}
              <Box sx={{ display: "flex", flexDirection: "row", gap: "1.5rem", mt: "1rem" }}>
                <Button
                  children="Download All Files"
                  variant="contained"
                  startIcon={<FileDownloadOutlined />}
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    downloadFile({ file_name: `sio-serv_${run.run_id}_outputs.zip`, file_url: `${SAPPORO_ENDPOINT}/runs/${run.run_id}/outputs?download=true` })
                  }}
                />
                <Button
                  children="Download RO-Crate"
                  variant="contained"
                  startIcon={<FileDownloadOutlined />}
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    downloadFile({ file_name: `sio-serv_${run.run_id}_ro-crate.json`, file_url: `${SAPPORO_ENDPOINT}/runs/${run.run_id}/ro-crate` })
                  }}
                />
              </Box>
            </Box>
          </Box>
        )
      }

      {/* Workflow Parameters */}
      {
        tabIndex === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem 1.5rem 1.5rem" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <RocketLaunchOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
              <Typography sx={{ fontSize: "1.4rem" }} children="Re-Execute Run" />
            </Box>
            {/* Re-exec form */}
            <Box sx={{ margin: "0 1.5rem 1.5rem" }}>
              <Form
                schema={schemaForForm}
                uiSchema={uiSchema}
                validator={validator}
                formData={wfParams}
                onChange={(e) => setWfParams(e.formData)}
                disabled={!editParams}
              />
              <Box sx={{ display: "flex", flexDirection: "row", gap: "1.5rem", mt: "0.5rem" }}>
                <Button
                  onClick={handleEditParams}
                  variant="outlined"
                  sx={{ textTransform: "none", width: "11rem" }}
                  startIcon={!editParams ?
                    <EditOutlined /> :
                    <UndoOutlined />
                  }
                  disabled={!auth.isAuthenticated || btnDisabled}
                  children={editParams ? "Undo Changes" : "Edit Parameters"}
                />
                <Button
                  onClick={execWf}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  startIcon={<RocketLaunchOutlined />}
                  disabled={!auth.isAuthenticated || btnDisabled}
                  children={auth.isAuthenticated ? "Re-Execute Workflow" : "Re-Execute Workflow (Please Sign In)"}
                />
              </Box>
            </Box>

            <Divider />

            <Box sx={{ mt: "1.5rem" }}>
              <Typography children="Raw Workflow Parameters:" sx={{ fontWeight: "bold", letterSpacing: "0.05rem", mb: "0.5rem" }} />
              <CodeBlock codeString={JSON.stringify(run.request?.workflow_params ?? "", null, 2)} language="json" />
            </Box>
          </Box>
        )
      }

      {/* Logs */}
      {
        tabIndex === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem 1.5rem 1.5rem" }}>
            <Box sx={{ display: "flex", flexDirection: "row", height: "2rem", alignItems: "center", mb: "0.5rem" }}>
              <Typography children="Exit Code:" sx={{ fontWeight: "bold", minWidth: "120px", letterSpacing: "0.05rem" }} />
              <Typography children={run.run_log?.exit_code ?? "N/A"} />
            </Box>
            {run.run_log?.stdout && <>
              <Typography children="Stdout:" sx={{ fontWeight: "bold", letterSpacing: "0.05rem", mb: "0.5rem" }} />
              <CodeBlock codeString={run.run_log?.stdout ?? ""} language="json" sx={{ mb: "1rem" }} />
            </>}
            {run.run_log?.stderr && <>
              <Typography children="Stderr:" sx={{ fontWeight: "bold", letterSpacing: "0.05rem", mb: "0.5rem" }} />
              <CodeBlock codeString={run.run_log?.stderr ?? ""} language="plaintext" />
            </>}
          </Box>
        )
      }
    </Box >
  )
}
