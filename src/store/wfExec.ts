import { atom } from "recoil"

export const wfParamsAtom = atom<Record<string, unknown>>({
  key: "sio-serv.wfParams",
  default: {},
})

export const showBatchRunsOnlyAtom = atom<boolean>({
  key: "sio-serv.showBatchRunsOnly",
  default: false,
})

export const batchRunIdsAtom = atom<string[]>({
  key: "sio-serv.batchRunIds",
  default: [],
})

export const uploadedBatchFileAtom = atom<Record<string, unknown>[]>({
  key: "sio-serv.uploadedBatchFile",
  default: [],
})
