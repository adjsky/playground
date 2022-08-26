import { z } from "zod"
import { TwirpFetchTransport } from "@protobuf-ts/twirp-transport"

import { createRouter } from "../context"
import supportedLanguages from "@/data/supported-languages"
import { HaberdasherClient } from "@/protos/sandbox.client"

const transport = new TwirpFetchTransport({
  baseUrl: "http://localhost:8080/twirp"
})
const client = new HaberdasherClient(transport)

export const codeRouter = createRouter().mutation("run", {
  input: z.object({
    lang: z.enum(supportedLanguages),
    code: z.string()
  }),
  async resolve({ input: { lang, code } }) {
    try {
      const data = await client.makeHat({ inches: 4 })
      console.log(data.response)
    } catch (e) {
      console.log(e)
    }

    return ""
  }
})
