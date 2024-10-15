import { SprRunRequestFile } from "@/types/configs"
import { ServiceInfo, ServiceInfoSchema, RunRequestFormData, RunId, RunIdSchema, RunLog, RunLogSchema, RunListResponse, State, RunListResponseSchema, RunSummary } from "@/types/spr"

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

export const nestToJsonPath = (wfParams: Record<string, unknown>): Record<string, unknown> => {
  const flattenedParams: Record<string, unknown> = {}

  const flatten = (obj: Record<string, unknown>, parentKey = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey === "" ? key : `${parentKey}.${key}`
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        flatten(value as Record<string, unknown>, newKey)
      } else {
        flattenedParams[newKey] = value
      }
    })
  }

  flatten(wfParams)

  return flattenedParams
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

export const getRuns = async (
  token: string,
  pageSize?: number,
  pageToken?: string | null,
  sortOrder?: "asc" | "desc",
  state?: State,
  run_ids?: string[],
  latest?: boolean,
): Promise<RunListResponse> => {
  const params = new URLSearchParams()
  if (pageSize !== undefined) params.set("page_size", pageSize.toString())
  if (pageToken !== undefined && pageToken !== null) params.set("page_token", pageToken)
  if (sortOrder !== undefined) params.set("sort_order", sortOrder)
  if (state !== undefined) params.set("state", state)
  if (run_ids !== undefined) run_ids.forEach((run_id) => params.append("run_ids", run_id))
  if (latest !== undefined) params.set("latest", latest.toString())
  try {
    const response = await fetch(`${SAPPORO_ENDPOINT}/runs?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error, failed to get runs, status: ${response.status}, statusText ${response.statusText}`)
    }
    const data = await response.json()
    const parseResult = await RunListResponseSchema.safeParseAsync(data)
    if (!parseResult.success) {
      throw new Error(`Schema validation failed: ${JSON.stringify(parseResult.error, null, 2)}`)
    }

    return parseResult.data
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to get runs: ${e.message}`)
    } else {
      throw new Error("An unknown error occurred during getRuns")
    }
  }
}

export const getAllRuns = async (
  token: string,
  pageSize = 100,
  latest = true,
): Promise<RunSummary[]> => {
  const allRuns: RunSummary[] = []
  let nextPageToken: string | undefined | null = undefined
  while (true) {
    const { runs, next_page_token } = await getRuns(token, pageSize, nextPageToken, undefined, undefined, undefined, latest)
    allRuns.push(...runs as RunSummary[])
    if (next_page_token === null || next_page_token === undefined || next_page_token === "") {
      break
    }
    nextPageToken = next_page_token
  }

  return allRuns
}

