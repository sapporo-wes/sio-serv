import { ListAltOutlined, DownloadOutlined, FileUploadOutlined, RocketLaunchOutlined, ExitToAppOutlined } from "@mui/icons-material"
import { Box, Card, Typography, Button, colors } from "@mui/material"
import { SxProps } from "@mui/system"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useErrorBoundary } from "react-error-boundary"
import { useAuth } from "react-oidc-context"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"

import CodeBlock from "@/components/CodeBlock"
import { convertToBatchTemplate, validateInputTemplate } from "@/lib/configs"
import { execBatchRuns, jsonPathToNest } from "@/lib/spr"
import { uiTableAtom, runRequestFileAtom } from "@/store/configs"
import { showBatchRunsOnlyAtom, batchRunIdsAtom, uploadedBatchFileAtom } from "@/store/wfExec"
import theme from "@/theme"

export interface BatchRunsSecProps {
  sx?: SxProps
}

export default function BatchRunsSec({ sx }: BatchRunsSecProps) {
  const auth = useAuth()
  const { showBoundary } = useErrorBoundary()
  const uiTable = useRecoilValue(uiTableAtom)
  const runRequestFile = useRecoilValue(runRequestFileAtom)

  const [executing, setExecuting] = useState(false)
  const setShowBatchRunsOnly = useSetRecoilState(showBatchRunsOnlyAtom)
  const [executedRunIds, setExecutedRunIds] = useRecoilState(batchRunIdsAtom)

  // Download template
  const downloadTemplate = () => {
    const csv = convertToBatchTemplate(uiTable)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sio-serv-batch-runs-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Upload and Validate
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedBatchFile, setUploadedBatchFile] = useRecoilState(uploadedBatchFileAtom)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [uploadedFilename, setUploadedFilename] = useState<string>("sio-serv-batch-runs.csv")
  const onDrop = (acceptedFiles: File[]) => {
    setUploadError(null)
    if (acceptedFiles.length === 0) {
      setUploadError("No file selected.")
      return
    } else if (acceptedFiles.length > 1) {
      setUploadError("Only one file can be uploaded.")
      return
    }
    const file = acceptedFiles[0]
    setUploadedFilename(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const batchFileContent = reader.result as string
      const result = validateInputTemplate(batchFileContent, uiTable)
      setUploadedBatchFile(result.data)
      setValidationErrors(result.errors)
      setExecutedRunIds([])
    }
    reader.onerror = () => {
      setUploadError("Failed to read the file.")
    }
    reader.onabort = () => {
      setUploadError("File reading aborted.")
    }
    reader.readAsText(file)
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })

  // Execute
  const execButtonEnabled =
    auth.isAuthenticated &&
    uploadedBatchFile.length > 0 &&
    validationErrors.length === 0 &&
    !executing &&
    executedRunIds.length === 0
  const execButtonLabel = () => {
    if (!auth.isAuthenticated) {
      return "Execute Batch Runs (Please Sign In)"
    } else if (uploadedBatchFile.length === 0) {
      return "Execute Batch Runs (No File Uploaded)"
    } else if (validationErrors.length > 0) {
      return "Execute Batch Runs (Validation Errors)"
    } else {
      return "Execute Batch Runs"
    }
  }
  const execRuns = async () => {
    setExecuting(true)
    execBatchRuns(
      runRequestFile,
      uploadedBatchFile.map((wfParams) => jsonPathToNest(wfParams)),
      auth.user!.access_token,
    ).then((runIds) => {
      setExecutedRunIds(runIds)
      setShowBatchRunsOnly(true)
      setExecuting(false)
    }).catch((e) => {
      showBoundary(e)
    })
  }
  const exportRunIds = () => {
    const header = ["\"Run ID\"", ...convertToBatchTemplate(uiTable).split("\n")[0].split(",")]
    const rows = executedRunIds.map((runId, i) => [runId, ...Object.values(uploadedBatchFile[i])])
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = uploadedFilename.replace(".csv", "-with-run-ids.csv")
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ListAltOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
        <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Execute Batch Runs" />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", margin: "1rem 1.5rem 0" }}>
        {/* Download */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h3" sx={{ fontSize: "1.3rem", fontWeight: "medium" }} children="1. Download Batch Runs Template" />
          <Box sx={{ margin: "0.5rem 1.5rem 0rem" }}>
            <Typography variant="body1" sx={{ color: colors.grey[700] }}>
              {"Download the CSV template to define parameters for batch runs."}
              <br />
              {"Each row represents a run, and each column represents a parameter."}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadOutlined />}
              onClick={downloadTemplate}
              sx={{ textTransform: "none", mt: "1rem" }}
              children={"Download Template"}
            >
            </Button>
          </Box>
        </Box>

        {/* Upload and Validate */}
        <Box sx={{ display: "flex", flexDirection: "column", mt: "1.5rem" }}>
          <Typography variant="h3" sx={{ fontSize: "1.3rem", fontWeight: "medium" }} children="2. Upload and Validate Edited Template" />
          <Box sx={{ margin: "0.5rem 1.5rem 0rem" }}>
            <Typography variant="body1" sx={{ color: colors.grey[700] }}>
              {"Upload the edited CSV file with the parameters for each run."}
              <br />
              {"sio-serv will validate the file to ensure that all required fields are filled and the values are correct before proceeding to execution."}
            </Typography>
            <Card {...getRootProps()} variant="outlined" sx={{ background: colors.grey[100], textAlign: "center", cursor: "pointer", maxWidth: "360px", mt: "1rem" }}>
              <input {...getInputProps()} />
              <Box sx={{ margin: "0.5rem" }}>
                <FileUploadOutlined sx={{ fontSize: "2rem" }} />
                {uploadError === null ? (isDragActive ?
                  <Typography variant="body1" children="Drop the file here." /> :
                  <Typography variant="body1" children="Drop the file here or click to select." />) :
                  <Typography variant="body1" sx={{ color: colors.red[400] }} children={uploadError} />}
              </Box>
            </Card>
            {validationErrors.length > 0 &&
              <Box sx={{ display: "flex", flexDirection: "column", mt: "1rem" }}>
                <Typography children="Validation Errors:" sx={{ fontWeight: "bold", letterSpacing: "0.05rem", mb: "0.5rem" }} />
                <CodeBlock codeString={validationErrors.join("\n")} language="plaintext" />
              </Box>
            }
            {
              uploadedBatchFile.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", mt: "1rem" }}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      mr: "0.5rem",
                      fontSize: "1.2rem",
                    }}
                    children={`${uploadedBatchFile.length} runs`}
                  />
                  <Typography children="are ready to be executed." />
                </Box>
              )
            }
          </Box>
        </Box>

        {/* Execute */}
        <Box sx={{ display: "flex", flexDirection: "column", mt: "1.5rem" }}>
          <Typography variant="h3" sx={{ fontSize: "1.3rem", fontWeight: "medium" }} children="3. Execute Runs" />
          <Box sx={{ margin: "0.5rem 1.5rem 0rem" }}>
            <Typography variant="body1" sx={{ color: colors.grey[700] }}>
              {"Execute the runs based on the uploaded CSV file."}
              <br />
              {"After execution, you can download the CSV with added Run IDs and load it into the 'Run History' section to browse the results."}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem", mt: "1rem" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RocketLaunchOutlined />}
                onClick={execRuns}
                sx={{ textTransform: "none" }}
                children={execButtonLabel()}
                disabled={!execButtonEnabled}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<ExitToAppOutlined />}
                onClick={exportRunIds}
                sx={{ textTransform: "none" }}
                children={"Export with Run IDs"}
                disabled={!(executedRunIds.length > 0 && uploadedBatchFile.length > 0)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
