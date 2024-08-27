import { JSONSchemaType } from "ajv"

// export type JSONSchema = JSONSchemaType<unknown>
export type JSONSchema = JSONSchemaType<unknown>

export interface TemplateTableRow {
  jsonPath: string
  type: "string" | "number" | "boolean" | "array"
  required: boolean
  default: string | number | boolean
  title: string
  description: string
}
