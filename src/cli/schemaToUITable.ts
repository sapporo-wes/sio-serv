import Papa from "papaparse"
import { fileURLToPath } from "url"
import { parseArgs } from "util"

import { resolvePath, existsFile, loadJson, writeFile } from "@/cli/utils"
import { validateJSONSchema, schemaToUITable, UI_TABLE_HEADER } from "@/lib/configs"
import { JSONSchema, UITableRow } from "@/types/configs"

interface CliArgs {
  inputPath: string
  outputPath: string
  outputFormat: "tsv" | "csv"
  pipe: boolean
}

const help = () => {
  console.error(`
Usage: schema-to-ui-table [OPTIONS]

Options:
  -i, --input <file>     Input workflow params schema file (required)
  -o, --output <file>    Output UI table file (default: ui-table.csv)
  -f, --format <format>  Output format: csv or tsv (default: csv)
  -p, --pipe             Write output to stdout
  -h, --help             Show this help message and exit

Examples:
  schema-to-ui-table -i wf-params-schema.json -o ui-table.csv
  schema-to-ui-table --input=wf-params-schema.json --pipe --format=tsv
`)
  process.exit(1)
}

const parseCliArgs = (args: string[]): CliArgs => {
  const { values } = parseArgs({
    args,
    options: {
      input: { type: "string", short: "i" },
      output: { type: "string", short: "o", default: "ui-table.csv" },
      format: { type: "string", short: "f", default: "csv" },
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
    if (values.format !== "csv" && values.format !== "tsv") {
      console.error(`Error: Invalid output format: ${values.format}`)
      process.exit(1)
    }
    return values.format as CliArgs["outputFormat"]
  })()

  return { inputPath, outputPath, outputFormat, pipe: values.pipe! }
}

const tableToString = (rows: UITableRow[], format: CliArgs["outputFormat"]): string => {
  const delimiter = format === "tsv" ? "\t" : ","
  const data: Record<typeof UI_TABLE_HEADER[number], string>[] = rows.map(row => ({
    "Parameter Key": row.jsonPath,
    "Title": row.title,
    "Description": row.description.replace(/\n/g, " "),
    "UI Component Type": row.type,
    "Default": String(row.default),
    "Required": String(row.required),
    "Editable": String(row.editable),
  }))

  return Papa.unparse(data, {
    delimiter,
    quotes: format === "csv", // CSV の場合はダブルクオートで囲む
    newline: "\n",
    header: true,
    columns: UI_TABLE_HEADER,
  })
}

const main = () => {
  const args = parseCliArgs(process.argv.slice(2))
  const schema = loadJson(args.inputPath) as JSONSchema
  try {
    validateJSONSchema(schema)
  } catch (e) {
    console.error(`Error: Invalid inputted schema: ${args.inputPath}${e instanceof Error ? ": " + e.message : ""}`)
    process.exit(1)
  }
  const tableRows = schemaToUITable(schema)
  const tableString = tableToString(tableRows, args.outputFormat)
  if (args.pipe) {
    console.log(tableString)
  } else {
    writeFile(args.outputPath, tableString)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
