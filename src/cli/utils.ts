// Split into utils.ts to use Node.js's things such as fs and path

import path from "path"
import fs from "fs"

export const resolvePath = (p: string): string => {
  if (!path.isAbsolute(p)) {
    return path.resolve(process.cwd(), p)
  }
  return p
}

export const existsFile = (p: string): boolean => {
  return fs.existsSync(p) && fs.statSync(p).isFile()
}

export const loadFile = (p: string): string => {
  return fs.readFileSync(p, "utf8")
}

export const writeFile = (p: string, content: string): void => {
  fs.writeFileSync(p, content)
}

export const loadJson = (p: string): Record<string, unknown> => {
  return JSON.parse(fs.readFileSync(p, "utf8"))
}
