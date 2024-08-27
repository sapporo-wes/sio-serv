import path from "path"
import fs from "fs"
import { JSONSchema } from "@/types"

export const resolvePath = (p: string): string => {
  if (!path.isAbsolute(p)) {
    return path.resolve(process.cwd(), p)
  }
  return p
}

export const existsFile = (p: string): boolean => {
  return fs.existsSync(p) && fs.statSync(p).isFile()
}

export const isObjectProps = (schema: JSONSchema): boolean => {
  return schema.type === "object" && schema.properties !== undefined
}

export const loadJson = (p: string): Record<string, unknown> => {
  return JSON.parse(fs.readFileSync(p, "utf8"))
}
