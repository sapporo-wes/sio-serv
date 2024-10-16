import { RocketLaunchOutlined } from "@mui/icons-material"
import { Box, Typography, Button } from "@mui/material"
import { SxProps } from "@mui/system"
import Form from "@rjsf/mui"
import validator from "@rjsf/validator-ajv8"
import { useState } from "react"
import { useErrorBoundary } from "react-error-boundary"
import { useAuth } from "react-oidc-context"
import { useNavigate } from "react-router-dom"
import { useRecoilValue, useRecoilState } from "recoil"

import { convertToSchemaForForm } from "@/lib/configs"
import { jsonPathToNest, postRuns } from "@/lib/spr"
import { uiTableAtom, runRequestFileAtom } from "@/store/configs"
import { wfParamsAtom } from "@/store/wfExec"

export interface SingleRunSecProps {
  sx?: SxProps
}

const uiSchema = {
  "ui:submitButtonOptions": {
    norender: true,
  },
}

export default function SingleRunSec({ sx }: SingleRunSecProps) {
  const auth = useAuth()
  const { showBoundary } = useErrorBoundary()
  const navigate = useNavigate()

  const runRequestFile = useRecoilValue(runRequestFileAtom)
  const uiTable = useRecoilValue(uiTableAtom)
  const schemaForForm = convertToSchemaForForm(uiTable)
  const [wfParams, setWfParams] = useRecoilState(wfParamsAtom)
  const [btnDisabled, setBtnDisabled] = useState(false)

  const execWf = async () => {
    setBtnDisabled(true)
    postRuns(runRequestFile, jsonPathToNest(wfParams), auth.user!.access_token).then((runId) => {
      setBtnDisabled(false)
      navigate(`/runs/${runId.run_id}`)
    }).catch((e) => {
      showBoundary(e)
    })
  }

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <RocketLaunchOutlined sx={{ fontSize: "1.6rem", mr: "0.5rem" }} />
        <Typography variant="h2" sx={{ fontSize: "1.8rem" }} children="Execute Single Run" />
      </Box>
      <Box sx={{ margin: "0 1.5rem" }}>
        <Form
          schema={schemaForForm}
          uiSchema={uiSchema}
          validator={validator}
          formData={wfParams}
          onChange={(e) => setWfParams(e.formData)}
        />
        <Button
          onClick={execWf}
          variant="contained"
          sx={{ textTransform: "none", mt: "0.5rem" }}
          startIcon={<RocketLaunchOutlined />}
          disabled={!auth.isAuthenticated || btnDisabled}
          children={
            auth.isAuthenticated ?
              "Execute Workflow" :
              "Execute Workflow (Please Sign In)"
          }
        />
      </Box>
    </Box>
  )
}
