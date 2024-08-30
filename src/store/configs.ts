import { atom } from "recoil"
import { JSONSchema, UITableRow } from "@/types/configs"
import { loadUITable } from "@/lib/configs"

export const uiTableAtom = atom<UITableRow[]>({
  key: "uiTable",
  default: loadUITable(UI_TABLE_FILE_CONTENT),
})

export const wfParamsSchemaAtom = atom<JSONSchema>({
  key: "wfParamsSchema",
  default: JSON.parse(WF_PARAMS_SCHEMA_FILE_CONTENT),
})
