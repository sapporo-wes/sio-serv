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
Usage: schema-to-table [OPTIONS]

Options:
  -i, --input <file>     Input workflow params schema file (required)
  -o, --output <file>    Output UI table file (default: ui-table.tsv)
  -f, --format <format>  Output format: tsv or csv (default: tsv)
  -p, --pipe             Write output to stdout
  -h, --help             Show this help message and exit

Examples:
  schema-to-table -i wf-params-schema.json -o ui-table.tsv
  schema-to-table --input=wf-params-schema.json --pipe --format=csv
`)
  process.exit(1)
}

const parseCliArgs = (args: string[]): CliArgs => {
  const { values } = parseArgs({
    args,
    options: {
      input: { type: "string", short: "i" },
      output: { type: "string", short: "o", default: "ui-table.tsv" },
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

const tableToString = (rows: UITableRow[], format: CliArgs["outputFormat"]): string => {
  const delimiter = format === "tsv" ? "\t" : ","
  return [
    UI_TABLE_HEADER.join(delimiter),
    ...rows.map(row => [row.jsonPath, row.title, row.description, row.type, row.default, row.required, row.editable].join(delimiter)),
  ].join("\n")
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
