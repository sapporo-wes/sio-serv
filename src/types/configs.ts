import { JSONSchema7 } from "json-schema"
import { z } from "zod"

export type JSONSchema = JSONSchema7

export interface UITableRow {
  jsonPath: string
  type: "string" | "number" | "boolean"
  required: boolean
  default: string | number | boolean
  title: string
  description: string
  editable: boolean
}

export const UITableRowSchema = z.object({
  jsonPath: z.string(),
  type: z.union([z.literal("string"), z.literal("number"), z.literal("boolean")]),
  required: z.boolean(),
  default: z.union([z.string(), z.number(), z.boolean()]),
  title: z.string(),
  description: z.string(),
  editable: z.boolean(),
})

interface FileObject {
  file_name: string
  file_url: string
}

export interface SprRunRequestFile {
  workflow_type: string
  workflow_type_version?: string | null
  workflow_engine: string
  workflow_engine_version?: string | null
  workflow_engine_parameters?: Record<string, string> | null
  workflow_url: string
  workflow_attachment_obj?: FileObject[] | null
  tags?: Record<string, string> | null
}

export const SprRunRequestFileSchema = z.object({
  workflow_type: z.string(),
  workflow_type_version: z.string().nullable().optional(),
  workflow_engine: z.string(),
  workflow_engine_version: z.string().nullable().optional(),
  workflow_engine_parameters: z.record(z.string()).nullable().optional(),
  workflow_url: z.string(),
  workflow_attachment_obj: z.array(z.object({ file_name: z.string(), file_url: z.string() })).nullable().optional(),
  tags: z.record(z.string()).nullable().optional(),
})
