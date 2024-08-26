import { fileURLToPath } from "url"
import { parseArgs } from "util"
import { resolvePath, existsFile } from "@/cli/utils"

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

const main = () => {
  const args = parseCliArgs(process.argv.slice(2))
  console.log(args)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
