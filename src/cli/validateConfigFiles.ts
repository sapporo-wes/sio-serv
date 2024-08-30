import { fileURLToPath } from "url"
import { parseArgs } from "util"
import { resolvePath, existsFile, loadJson, loadFile } from "@/cli/utils"
import { validateJSONSchema, loadUITable, validateInputtedUITable, schemaToUITable } from "@/lib/configs"
import { SprRunRequestFileSchema } from "@/types/configs"

interface CliArgs {
  wfParamsSchema: string
  uiTable: string
  runRequest?: string
}

const help = () => {
  console.error(`
Usage: validate-config-files [OPTIONS]

Options:
  -w, --wf-params-schema <file>   Workflow params schema file (required)
  -u, --ui-table <file>           UI table file (required)
  -r, --run-request <file>         Run request file
  -h, --help                      Show this help message and exit

Examples:
  validate-config-files -w wf-params-schema.json -u ui-table.tsv
  validate-config-files --wf-params-schema=wf-params-schema.json --ui-table=ui-table.tsv --run-request=run-request.json
`)
  process.exit(1)
}

const parseCliArgs = (args: string[]): CliArgs => {
  const { values } = parseArgs({
    args,
    options: {
      wfParamsSchema: { type: "string", short: "w" },
      uiTable: { type: "string", short: "u" },
      runRequest: { type: "string", short: "r" },
      help: { type: "boolean", short: "h" },
    },
  })

  if (values.help) help()

  const wfParamsSchema = (() => {
    if (!values.wfParamsSchema) {
      console.error("Error: Missing required argument --wf-params-schema")
      help()
    }
    const resolvedPath = resolvePath(values.wfParamsSchema!)
    if (!existsFile(resolvedPath)) {
      console.error(`Error: File not found: ${resolvedPath}`)
      process.exit(1)
    }
    return resolvedPath
  })()
  const uiTable = (() => {
    if (!values.uiTable) {
      console.error("Error: Missing required argument --ui-table")
      help()
    }
    const resolvedPath = resolvePath(values.uiTable!)
    if (!existsFile(resolvedPath)) {
      console.error(`Error: File not found: ${resolvedPath}`)
      process.exit(1)
    }
    return resolvedPath
  })()
  const runRequest = (() => {
    if (values.runRequest !== undefined) {
      const resolvedPath = resolvePath(values.runRequest!)
      if (!existsFile(resolvedPath)) {
        console.error(`Error: File not found: ${resolvedPath}`)
        process.exit(1)
      }
      return resolvedPath
    }
    return undefined
  })()

  return { wfParamsSchema, uiTable, runRequest }
}

const main = () => {
  const args = parseCliArgs(process.argv.slice(2))
  const wfParamsSchema = loadJson(args.wfParamsSchema)
  try {
    validateJSONSchema(wfParamsSchema)
  } catch (e) {
    console.error(`An error occurred while validating workflow params schema: ${args.wfParamsSchema}${e instanceof Error ? ": " + e.message : ""}`)
    process.exit(1)
  }
  try {
    const uiTableContent = loadFile(args.uiTable)
    const inputtedUITable = loadUITable(uiTableContent)
    validateInputtedUITable(inputtedUITable, schemaToUITable(wfParamsSchema))
  } catch (e) {
    console.error(`An error occurred while validating UI table: ${args.uiTable}${e instanceof Error ? ": " + e.message : ""}`)
    process.exit(1)
  }
  if (args.runRequest !== undefined) {
    const runRequest = loadJson(args.runRequest)
    const { success, error } = SprRunRequestFileSchema.safeParse(runRequest)
    if (!success) {
      console.error(`An error occurred while validating run request: ${args.runRequest}: ${error.message}`)
      process.exit(1)
    }
  }

  console.log("Validation successful")
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
