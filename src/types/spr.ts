import { SprRunRequestFileSchema, SprRunRequestFile } from "@/types/configs"
import { z } from "zod"

export interface SprRunRequest extends SprRunRequestFile {
  workflow_params: string
}

export const SprRunRequestSchema = z.object({
  ...SprRunRequestFileSchema.shape,
  workflow_params: z.string(),
})
