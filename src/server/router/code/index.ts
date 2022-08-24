import { z } from "zod"

import { createRouter } from "../context"
import run from "@/server/sandbox/run"
import supportedLanguages from "@/data/supported-languages"

export const codeRouter = createRouter().mutation("run", {
  input: z.object({
    lang: z.enum(supportedLanguages),
    code: z.string()
  }),
  async resolve({ input: { lang, code } }) {
    return await run(lang, code)
  }
})
