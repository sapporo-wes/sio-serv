import { z } from "zod"

export interface RunRequestFormData {
  workflow_params?: string | null
  workflow_type: string
  workflow_type_version?: string | null
  tags?: string | null
  workflow_engine: string
  workflow_engine_version?: string | null
  workflow_engine_parameters?: string | null
  workflow_url?: string | null
  workflow_attachment_obj?: string | null
}

// https://github.com/sapporo-wes/sapporo-service/blob/main/sapporo/schemas.py

export interface FileObject {
  file_name: string
  file_url: string
}

export const FileObjectSchema = z.object({
  file_name: z.string(),
  file_url: z.string(),
})

export interface OutputsListResponse {
  outputs: FileObject[]
}

export const OutputsListResponseSchema = z.object({
  outputs: z.array(FileObjectSchema),
})

export interface ExecutableWorkflows {
  workflows: string[]
}

export const ExecutableWorkflowsSchema = z.object({
  workflows: z.array(z.string()),
})

export interface ServiceType {
  group: string
  artifact: string
  version: string
}

export const ServiceTypeSchema = z.object({
  group: z.string(),
  artifact: z.string(),
  version: z.string(),
})

export interface Organization {
  name: string
  url: string
}

export const OrganizationSchema = z.object({
  name: z.string(),
  url: z.string(),
})

export interface Service {
  id: string
  name: string
  type: ServiceType
  description?: string | null
  organization: Organization
  contactUrl?: string | null
  documentationUrl?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  environment?: string | null
  version: string
}

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ServiceTypeSchema,
  description: z.string().optional().nullable(),
  organization: OrganizationSchema,
  contactUrl: z.string().optional().nullable(),
  documentationUrl: z.string().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
  environment: z.string().optional().nullable(),
  version: z.string(),
})

export interface WorkflowTypeVersion {
  workflow_type_version?: string[] | null
}

export const WorkflowTypeVersionSchema = z.object({
  workflow_type_version: z.array(z.string()).optional().nullable(),
})

export interface WorkflowEngineVersion {
  workflow_engine_version?: string[] | null
}

export const WorkflowEngineVersionSchema = z.object({
  workflow_engine_version: z.array(z.string()).optional().nullable(),
})

export interface DefaultWorkflowEngineParameter {
  name?: string | null
  type?: string | null
  default_value?: string | null
}

export const DefaultWorkflowEngineParameterSchema = z.object({
  name: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  default_value: z.string().optional().nullable(),
})

export interface ServiceInfo extends Service {
  workflow_type_versions: Record<string, WorkflowTypeVersion>
  supported_wes_versions: string[]
  supported_filesystem_protocols: string[]
  workflow_engine_versions: Record<string, WorkflowEngineVersion>
  default_workflow_engine_parameters: Record<string, DefaultWorkflowEngineParameter[]>
  system_state_counts: Record<string, number>
  auth_instructions_url: string
  tags: Record<string, string>
}

export const ServiceInfoSchema = ServiceSchema.extend({
  workflow_type_versions: z.record(WorkflowTypeVersionSchema),
  supported_wes_versions: z.array(z.string()),
  supported_filesystem_protocols: z.array(z.string()),
  workflow_engine_versions: z.record(WorkflowEngineVersionSchema),
  default_workflow_engine_parameters: z.record(z.array(DefaultWorkflowEngineParameterSchema)),
  system_state_counts: z.record(z.number()),
  auth_instructions_url: z.string(),
  tags: z.record(z.string()),
})

export type State = "UNKNOWN"
  | "QUEUED"
  | "INITIALIZING"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETE"
  | "EXECUTOR_ERROR"
  | "SYSTEM_ERROR"
  | "CANCELED"
  | "CANCELING"
  | "PREEMPTED"
  | "DELETED"
  | "DELETING"

export const StateSchema = z.enum([
  "UNKNOWN",
  "QUEUED",
  "INITIALIZING",
  "RUNNING",
  "PAUSED",
  "COMPLETE",
  "EXECUTOR_ERROR",
  "SYSTEM_ERROR",
  "CANCELED",
  "CANCELING",
  "PREEMPTED",
  "DELETED",
  "DELETING",
])

export interface RunStatus {
  run_id: string
  state?: State | null
}

export const RunStatusSchema = z.object({
  run_id: z.string(),
  state: StateSchema.optional().nullable(),
})

export interface RunSummary extends RunStatus {
  start_time?: string | null
  end_time?: string | null
  tags: Record<string, string>
}

export const RunSummarySchema = RunStatusSchema.extend({
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  tags: z.record(z.string()),
})

export interface RunListResponse {
  runs?: (RunStatus | RunSummary)[] | null
  next_page_token?: string | null
}

export const RunListResponseSchema = z.object({
  runs: z.array(z.union([RunSummarySchema, RunStatusSchema])).optional().nullable(),
  next_page_token: z.string().optional().nullable(),
})

export interface RunRequest {
  workflow_params: Record<string, unknown> | string
  workflow_type: string
  workflow_type_version: string
  tags?: Record<string, string> | null
  workflow_engine?: string | null
  workflow_engine_parameters?: string | null
  workflow_url: string
}

export const RunRequestSchema = z.object({
  workflow_params: z.union([z.record(z.unknown()), z.string()]),
  workflow_type: z.string(),
  workflow_type_version: z.string(),
  tags: z.record(z.string()).optional().nullable(),
  workflow_engine: z.string().optional().nullable(),
  workflow_engine_parameters: z.string().optional().nullable(),
  workflow_url: z.string(),
})

export interface RunId {
  run_id: string
}

export const RunIdSchema = z.object({
  run_id: z.string(),
})

export interface Log {
  name?: string | null
  cmd?: string[] | null
  start_time?: string | null
  end_time?: string | null
  stdout?: string | null
  stderr?: string | null
  exit_code?: number | null
  system_logs?: string[] | null
}

export const LogSchema = z.object({
  name: z.string().optional().nullable(),
  cmd: z.array(z.string()).optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  stdout: z.string().optional().nullable(),
  stderr: z.string().optional().nullable(),
  exit_code: z.number().optional().nullable(),
  system_logs: z.array(z.string()).optional().nullable(),
})

export interface TaskLog extends Log {
  id: string
  name: string
  system_logs?: string[] | null
  tes_uri?: string | null
}

export const TaskLogSchema = LogSchema.extend({
  id: z.string(),
  name: z.string(),
  system_logs: z.array(z.string()).optional().nullable(),
  tes_uri: z.string().optional().nullable(),
})

export interface RunLog {
  run_id?: string | null
  request?: RunRequest | null
  state?: State | null
  run_log?: Log | null
  task_logs_url?: string | null
  task_logs?: (Log | TaskLog)[] | null
  outputs?: FileObject[] | null
}

export const RunLogSchema = z.object({
  run_id: z.string().optional().nullable(),
  request: RunRequestSchema.optional().nullable(),
  state: StateSchema.optional().nullable(),
  run_log: LogSchema.optional().nullable(),
  task_logs_url: z.string().optional().nullable(),
  task_logs: z.array(z.union([TaskLogSchema, LogSchema])).optional().nullable(),
  outputs: z.array(FileObjectSchema).optional().nullable(),
})

export interface TaskListResponse {
  tasks?: TaskLog[] | null
  next_page_token?: string | null
}

export const TaskListResponseSchema = z.object({
  tasks: z.array(TaskLogSchema).optional().nullable(),
  next_page_token: z.string().optional().nullable(),
})

export interface ErrorResponse {
  msg: string
  status_code: number
}

export const ErrorResponseSchema = z.object({
  msg: z.string(),
  status_code: z.number(),
})
