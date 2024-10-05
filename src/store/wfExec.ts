import { atom } from "recoil"

export const wfParamsAtom = atom<Record<string, unknown>>({
  key: "sio-serv.wfParams",
  default: {},
})
