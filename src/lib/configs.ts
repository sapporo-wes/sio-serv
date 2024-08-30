import { UITableRow, UITableRowSchema, JSONSchema } from "@/types/configs"
import Ajv from "ajv"

export const validateJSONSchema = (schema: JSONSchema): void => {
  const ajv = new Ajv()
  const valid = ajv.validateSchema(schema)
  if (!valid) {
    throw new Error(`Invalid JSON schema: ${ajv.errorsText(ajv.errors)}`)
  }
}

export const UI_TABLE_HEADER = ["Parameter Key", "Title", "Description", "UI Component Type", "Default", "Required", "Editable"]

export const schemaToUITable = (schema: JSONSchema, parentPath = ""): UITableRow[] => {
  const rows: UITableRow[] = []

  if (schema.type === "object" && schema.properties !== undefined) {
    const requiredFields = new Set(schema.required || [])
    for (const [key, value] of Object.entries(schema.properties!) as [string, JSONSchema][]) {
      const jsonPath = parentPath !== "" ? `${parentPath}.${key}` : key
      if (value.type !== "object") {
        if (value.type === "null") {
          continue // TODO: handle null type, if needed
        }
        // TODO: handle type written as array, e.g. ["string", "number"]
        const type = value.type
        const required = requiredFields.has(key)
        const defaultValue = (() => {
          const val = value.default || value.const || undefined
          if (val === undefined) return ""
          if (type === "string") return String(val)
          if (type === "number") return Number(val)
          if (type === "boolean") return Boolean(val)
          if (type === "array") return JSON.stringify(val)
          return ""
        })()
        const title = value.title || ""
        const description = value.description || ""

        const { success, data, error } = UITableRowSchema.safeParse({
          jsonPath,
          type: type === "array" ? "string" : type,
          required,
          default: defaultValue,
          title,
          description,
          editable: true,
        })
        if (!success) {
          console.error(`An error occurred while converting schema to table: ${error.message}`)
          process.exit(1)
        }
        rows.push(data)
      } else {
        rows.push(...schemaToUITable(value, jsonPath))
      }
    }
  }

  return rows
}

const isTsvFile = (headerRow: string): boolean => {
  return headerRow.includes("\t")
}

export const loadUITable = (uiTableContent: string): UITableRow[] => {
  const row = uiTableContent.split("\n")
  const delimiter = isTsvFile(row[0]) ? "\t" : ","
  const header = row[0].split(delimiter)
  header.forEach((col, i) => {
    if (col !== UI_TABLE_HEADER[i]) {
      throw new Error(`Invalid UI Table file: header mismatch at column ${i + 1}: ${col}`)
    }
  })
  return row.slice(1).map((line, i) => {
    if (line === "") return null
    const cols = line.split(delimiter)
    if (cols.length !== header.length) {
      throw new Error(`Invalid UI Table file: row length mismatch at row ${i + 2}: ${cols[0] || "<empty>"}`)
    }
    const typeValue = cols[3]
    const defaultValue = (() => {
      if (typeValue === "string") return cols[4]
      if (typeValue === "number") return JSON.parse(cols[4])
      if (typeValue === "boolean") return JSON.parse(cols[4])
    })()
    const { success, data, error } = UITableRowSchema.safeParse({
      jsonPath: cols[0],
      title: cols[1],
      description: cols[2],
      type: typeValue,
      default: defaultValue,
      required: JSON.parse(cols[5]),
      editable: JSON.parse(cols[6]),
    })
    if (!success) {
      throw new Error(`Invalid UI Table file: at row ${i + 2}: ${error.message}`)
    }
    return data
  }).filter((row) => row !== null)
}

export const loadSchema = (): JSONSchema => {
  return JSON.parse(WF_PARAMS_SCHEMA_FILE_CONTENT)
}

export const validateInputtedUITable = (inputtedUITable: UITableRow[], uiTableFromSchema: UITableRow[]) => {
  // The UI Table is intended to assist in the display within the UI, but the final workflow parameters must adhere to the schema.
  // Therefore, the edited content of the UI Table needs to be validated to ensure it complies with the original schema.
  // Current specs: (TODO: There are likely many other cases to consider)

  // - The jsonPath must match.
  // - If an item is marked as required: true in the schema, it must also be required: true in the UI Table.

  const jsonPathSet = new Set(uiTableFromSchema.map((row) => row.jsonPath))
  for (const row of inputtedUITable) {
    if (!jsonPathSet.has(row.jsonPath)) {
      throw new Error(`Invalid UI Table: jsonPath ${row.jsonPath} not found`)
    }
    const schemaRow = uiTableFromSchema.find((r) => r.jsonPath === row.jsonPath)!
    if (schemaRow.required && !row.required) {
      throw new Error(`Invalid UI Table: ${row.jsonPath} is required in the schema but not in the UI Table`)
    }
  }
}

export const convertToSchemaForForm = (uiTable: UITableRow[]): JSONSchema => {
  const schema: JSONSchema = {
    type: "object",
    properties: {},
    required: [],
  }
  for (const row of uiTable) {
    schema.properties![row.jsonPath] = {
      type: row.type,
      title: row.title,
      description: row.description,
      default: row.default,
    }
    if (row.required) {
      schema.required!.push(row.jsonPath)
    }
  }

  return schema
}
