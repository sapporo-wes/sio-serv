import * as path from "path"
import * as fs from "fs"

export const resolvePath = (p: string): string => {
  if (!path.isAbsolute(p)) {
    return path.resolve(process.cwd(), p)
  }
  return p
}

export const existsFile = (p: string): boolean => {
  return fs.existsSync(p) && fs.statSync(p).isFile()
}
