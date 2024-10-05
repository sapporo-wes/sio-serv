import { atom } from "recoil"

import { loadUITable } from "@/lib/configs"
import { JSONSchema, UITableRow, SprRunRequestFile } from "@/types/configs"

export const uiTableAtom = atom<UITableRow[]>({
  key: "sio-serv.uiTable",
  default: loadUITable(UI_TABLE_FILE_CONTENT),
})

export const wfParamsSchemaAtom = atom<JSONSchema>({
  key: "sio-serv.wfParamsSchema",
  default: JSON.parse(WF_PARAMS_SCHEMA_FILE_CONTENT),
})

export const runRequestFileAtom = atom<SprRunRequestFile>({
  key: "sio-serv.runRequestFile",
  default: JSON.parse(RUN_REQUEST_FILE_CONTENT),
})
