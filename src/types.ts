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
