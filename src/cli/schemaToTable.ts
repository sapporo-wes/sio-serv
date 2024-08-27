import { fileURLToPath } from "url"
import { parseArgs } from "util"
import { resolvePath, existsFile, isObjectProps, loadJson } from "@/cli/utils"
import { JSONSchema, TemplateTableRow } from "@/types"
import fs from "fs"

interface CliArgs {
  inputPath: string
  outputPath: string
  outputFormat: "tsv" | "csv"
  pipe: boolean
}

const help = () => {
  console.error(`
Usage: schema-to-table [OPTIONS]

Options:
  -i, --input <file>     Input schema file (required)
  -o, --output <file>    Output table file (default: output.tsv)
  -f, --format <format>  Output format: tsv or csv (default: tsv)
  -p, --pipe             Write output to stdout
  -h, --help             Show this help message and exit

Examples:
  schema-to-table -i schema.json -o table.tsv
  schema-to-table --input=schema.json --pipe --format=csv
`)
  process.exit(1)
}

const parseCliArgs = (args: string[]): CliArgs => {
  const { values } = parseArgs({
    args,
    options: {
      input: { type: "string", short: "i" },
      output: { type: "string", short: "o", default: "output.tsv" },
      format: { type: "string", short: "f", default: "tsv" },
      pipe: { type: "boolean", short: "p" },
      help: { type: "boolean", short: "h" },
    },
  })

  if (values.help) help()

  const inputPath = (() => {
    if (!values.input) {
      console.error("Error: Missing required argument --input")
      help()
    }
    const resolvedPath = resolvePath(values.input!)
    if (!existsFile(resolvedPath)) {
      console.error(`Error: File not found: ${resolvedPath}`)
      process.exit(1)
    }
    return resolvedPath
  })()
  const outputPath = resolvePath(values.output!)
  const outputFormat = (() => {
    if (values.format !== "tsv" && values.format !== "csv") {
      console.error(`Error: Invalid output format: ${values.format}`)
      process.exit(1)
    }
    return values.format as CliArgs["outputFormat"]
  })()

  return { inputPath, outputPath, outputFormat, pipe: values.pipe! }
}

const schemaToTable = (schema: JSONSchema, parentPath = ""): TemplateTableRow[] => {
  const rows: TemplateTableRow[] = []

  if (isObjectProps(schema)) {
    const requiredFields = new Set(schema.required || [])
    for (const [key, value] of Object.entries(schema.properties!) as [string, JSONSchema][]) {
      const jsonPath = parentPath !== "" ? `${parentPath}.${key}` : key
      if (value.type !== "object") {
        if (value.type === "null") {
          continue // TODO: handle null type, if needed
        }
        // TODO: handle type written as array, e.g. ["string", "number"]
        const type = value.type as TemplateTableRow["type"]
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

        rows.push({ jsonPath, type, required, default: defaultValue, title, description })
      } else {
        rows.push(...schemaToTable(value, jsonPath))
      }
    }
  }

  return rows
}

const tableToString = (rows: TemplateTableRow[], format: CliArgs["outputFormat"]): string => {
  const delimiter = format === "tsv" ? "\t" : ","
  const header = ["Parameter Key", "Title", "Description", "UI Component Type", "Default", "Required", "Editable"]
  return [
    header.join(delimiter),
    ...rows.map(row => [row.jsonPath, row.title, row.description, row.type, row.default, row.required, true].join(delimiter)),
  ].join("\n")
}

const main = () => {
  const args = parseCliArgs(process.argv.slice(2))
  const schema = loadJson(args.inputPath) as JSONSchema
  const tableRows = schemaToTable(schema)
  const tableString = tableToString(tableRows, args.outputFormat)
  if (args.pipe) {
    console.log(tableString)
  }
  fs.writeFileSync(args.outputPath, tableString)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
