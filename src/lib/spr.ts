import { SprRunRequestFile } from "@/types/configs"
import { ServiceInfo, ServiceInfoSchema, RunRequestFormData, RunId, RunIdSchema, RunLog, RunLogSchema } from "@/types/spr"

export const getServiceInfo = async (): Promise<ServiceInfo> => {
  try {
    const response = await fetch(`${SAPPORO_ENDPOINT}/service-info`)
    if (!response.ok) {
      throw new Error(`HTTP error, failed to get service info, status: ${response.status}, statusText ${response.statusText}`)
    }
    const data = await response.json()
    const parseResult = await ServiceInfoSchema.safeParseAsync(data)
    if (!parseResult.success) {
      throw new Error(`Schema validation failed: ${JSON.stringify(parseResult.error, null, 2)}`)
    }

    return parseResult.data
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to get service info: ${e.message}`)
    } else {
      throw new Error("An unknown error occurred during getServiceInfo")
    }
  }
}

const runRequestToFormData = (runRequestFile: SprRunRequestFile, wfParams: Record<string, unknown>): FormData => {
  const runRequestFormData: RunRequestFormData = {
    workflow_params: JSON.stringify(wfParams),
    workflow_type: runRequestFile.workflow_type,
    workflow_type_version: runRequestFile.workflow_type_version,
    tags: runRequestFile.tags ? JSON.stringify(runRequestFile.tags) : runRequestFile.tags,
    workflow_engine: runRequestFile.workflow_engine,
    workflow_engine_parameters: runRequestFile.workflow_engine_parameters ? JSON.stringify(runRequestFile.workflow_engine_parameters) : runRequestFile.workflow_engine_parameters,
    workflow_url: runRequestFile.workflow_url,
    workflow_attachment_obj: runRequestFile.workflow_attachment_obj ? JSON.stringify(runRequestFile.workflow_attachment_obj) : runRequestFile.workflow_attachment_obj,
  }

  const formData = new FormData()
  for (const [key, value] of Object.entries(runRequestFormData)) {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  }

  return formData
}

export const jsonPathToNest = (wfParams: Record<string, unknown>): Record<string, unknown> => {
  const nestedParams: Record<string, unknown> = {}

  Object.entries(wfParams).forEach(([key, value]) => {
    const keys = key.split(".")
    let nested = nestedParams
    for (let i = 0; i < keys.length - 1; i++) {
      if (nested[keys[i]] === undefined) {
        nested[keys[i]] = {}
      }
      nested = nested[keys[i]] as Record<string, unknown>
    }
    nested[keys[keys.length - 1]] = value
  })

  return nestedParams
}

export const postRuns = async (runRequestFile: SprRunRequestFile, wfParams: Record<string, unknown>, token: string): Promise<RunId> => {
  try {
    const formData = runRequestToFormData(runRequestFile, wfParams)
    const response = await fetch(`${SAPPORO_ENDPOINT}/runs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) {
      throw new Error(`HTTP error, failed to post runs, status: ${response.status}, statusText ${response.statusText}`)
    }
    const data = await response.json()
    const parseResult = await RunIdSchema.safeParseAsync(data)
    if (!parseResult.success) {
      throw new Error(`Schema validation failed: ${JSON.stringify(parseResult.error, null, 2)}`)
    }

    return parseResult.data
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to post runs: ${e.message}`)
    } else {
      throw new Error("An unknown error occurred during postRuns")
    }
  }
}

export const getRun = async (runId: string, token: string): Promise<RunLog> => {
  try {
    const response = await fetch(`${SAPPORO_ENDPOINT}/runs/${runId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error, failed to get run (runId: ${runId}), status: ${response.status}, statusText ${response.statusText}`)
    }
    const data = await response.json()
    const parseResult = await RunLogSchema.safeParseAsync(data)
    if (!parseResult.success) {
      throw new Error(`Schema validation failed (runId: ${runId}): ${JSON.stringify(parseResult.error, null, 2)}`)
    }

    return parseResult.data
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to get run (runId: ${runId}): ${e.message}`)
    } else {
      throw new Error(`An unknown error occurred during getRun (runId: ${runId})`)
    }
  }
}
