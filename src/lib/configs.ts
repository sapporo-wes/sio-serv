import Ajv from "ajv"
import Papa from "papaparse"

import { UITableRow, UITableRowSchema, JSONSchema } from "@/types/configs"

export const validateJSONSchema = (schema: JSONSchema): void => {
  const ajv = new Ajv()
  const valid = ajv.validateSchema(schema)
  if (!valid) {
    throw new Error(`Invalid JSON schema: ${ajv.errorsText(ajv.errors)}`)
  }
}

export const UI_TABLE_HEADER = [
  "Parameter Key",
  "Title",
  "Description",
  "UI Component Type",
  "Default",
  "Required",
  "Editable",
]

export const schemaToUITable = (schema: JSONSchema, parentPath = ""): UITableRow[] => {
  const rows: UITableRow[] = []
  if (schema.type === "object" && schema.properties !== undefined) {
    const requiredFields = new Set(schema.required ?? [])
    for (const [key, value] of Object.entries(schema.properties!) as [string, JSONSchema][]) {
      const jsonPath = parentPath !== "" ? `${parentPath}.${key}` : key
      if (value.type !== "object") {
        const type = value.type
        // JSONSchema7TypeName = "string" | "number" | "integer" | "boolean" | "object" | "array" | "null"
        if (typeof type !== "string" || !["string", "number", "integer", "boolean", "array"].includes(type)) {
          throw new Error(`Invalid JSON schema: ${jsonPath} has unsupported type: ${type}, sio-serv only supports "string", "number", "integer", "boolean", and "array"`)
        }
        const required = requiredFields.has(key)
        const defaultValue = (() => {
          const val = value.default ?? value.const ?? undefined
          if (val === undefined) return ""
          if (type === "string") return String(val)
          if (type === "number" || type === "integer") return Number(val)
          if (type === "boolean") return Boolean(val)
          if (type === "array") return JSON.stringify(val)
          return ""
        })()
        const title = value.title ?? jsonPath
        const description = value.description ?? ""

        const { success, data, error } = UITableRowSchema.safeParse({
          jsonPath,
          type: (() => {
            if (type === "array") {
              return "string"
            }
            if (type === "number" || type === "integer") {
              return "number"
            }
            return type
          })(),
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

export const loadUITable = (uiTableContent: string): UITableRow[] => {
  const { data, errors } = Papa.parse<string[]>(uiTableContent, {
    header: false,
    skipEmptyLines: true,
  })

  if (errors.length > 0) {
    throw new Error(`Invalid UI Table file: ${errors.map((e) => e.message).join(", ")}`)
  }

  const header = data[0]
  header.forEach((col, i) => {
    if (col !== UI_TABLE_HEADER[i]) {
      throw new Error(`Invalid UI Table file: header mismatch at column ${i + 1}: ${col}`)
    }
  })

  return data.slice(1).map((cols, i) => {
    if (cols.length !== header.length) {
      throw new Error(`Invalid UI Table file: row length mismatch at row ${i + 2}: ${cols[0] ?? "<empty>"}`)
    }
    const [jsonPath, title, description, typeValue, tmpDefaultValue, required, editable] = cols
    const defaultValue = (() => {
      if (typeValue === "string") return tmpDefaultValue
      if (typeValue === "number") return isNaN(Number(tmpDefaultValue)) ? tmpDefaultValue : Number(tmpDefaultValue)
      if (typeValue === "boolean") return tmpDefaultValue.toLowerCase() === "true" ? true : tmpDefaultValue.toLowerCase() === "false" ? false : tmpDefaultValue
    })()

    const { success, data, error } = UITableRowSchema.safeParse({
      jsonPath,
      title,
      description,
      type: typeValue,
      default: defaultValue,
      required: JSON.parse(required),
      editable: JSON.parse(editable),
    })
    if (!success) {
      throw new Error(`Invalid UI Table file: at row ${i + 2}: ${error.message}`)
    }

    return data
  })
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

const batchTemplateHeader = (uiTable: UITableRow[]): string[] => {
  return uiTable.map((row) => `${row.title} (${row.type}${row.required ? "; required" : ""})`)
}

export const convertToBatchTemplate = (uiTable: UITableRow[]): string => {
  const header = batchTemplateHeader(uiTable)
  const exampleRow = uiTable.map((row) => row.default ?? "")

  const csvString = Papa.unparse({
    fields: header,
    data: [exampleRow],
  }, {
    quotes: true,
  })

  return csvString
}

interface ValidationResult {
  success: boolean
  data: Record<string, unknown>[]
  errors: string[]
}

/**
 * Validates the inputted CSV template content against the UI Table.
 *
 * The validation includes:
 * 1. Whether the header row is correct
 * 2. Whether each row has the correct number of elements
 * 3. Whether each row is parsed and adheres to the JSON schema based on the UI Table
 *
 * The validation result is returned as an array of natural language error messages.
 * Example error messages include:
 * - "Header Row: Incorrect header format (Expected: ..., Actual: ...)"
 * - "Row 2: Incorrect number of elements"
 * - "Row 3: JSON schema error (Error: ...)"
 */
export const validateInputTemplate = (content: string, uiTable: UITableRow[]): ValidationResult => {
  const result: ValidationResult = {
    success: true,
    errors: [],
    data: [],
  }

  const jsonSchema = convertToSchemaForForm(uiTable)

  const { data, errors } = Papa.parse<string[]>(content, {
    header: false,
    skipEmptyLines: true,
  })
  if (errors.length > 0) {
    result.errors.push(`Invalid CSV file: ${errors.map((e) => e.message).join(", ")}`)
    result.success = false
    return result
  }

  const [inputHeader, ...rows] = data
  const expectedHeader = batchTemplateHeader(uiTable)

  // 1. Validate header row
  if (inputHeader.join(",") !== expectedHeader.join(",")) {
    result.errors.push(`Header Row: Incorrect header format (Expected: ${expectedHeader.join(",")}, Actual: ${inputHeader.join(",")})`)
  }

  const ajv = new Ajv()
  rows.forEach((cols, rowIndex) => {
    // 2. Validate each row
    if (cols.length !== expectedHeader.length) {
      result.errors.push(`Row ${rowIndex + 2}: Incorrect number of elements`)
      return
    }

    // 3. Validate JSON schema
    const wfParams: Record<string, unknown> = {}
    cols.forEach((col, colIndex) => {
      if (uiTable[colIndex].type === "number") {
        wfParams[uiTable[colIndex].jsonPath] = isNaN(Number(col)) ? col : Number(col)
      } else if (uiTable[colIndex].type === "boolean") {
        wfParams[uiTable[colIndex].jsonPath] = col.toLowerCase() === "true" ? true : col.toLowerCase() === "false" ? false : col
      } else { // string
        wfParams[uiTable[colIndex].jsonPath] = col
      }
    })
    const valid = ajv.validate(jsonSchema, wfParams)
    if (!valid) {
      result.errors.push(`Row ${rowIndex + 2}: JSONSchema error (Error: ${ajv.errorsText(ajv.errors)})`)
    } else {
      result.data.push(wfParams)
    }
  })

  if (result.errors.length > 0) {
    result.success = false
  }

  return result
}
