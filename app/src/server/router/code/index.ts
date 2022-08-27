import { z } from "zod"
import { TwirpFetchTransport } from "@protobuf-ts/twirp-transport"

import { createRouter } from "../context"
import { SandboxClient } from "@/protos/sandbox.client"
import { Languages } from "@/protos/sandbox"

const transport = new TwirpFetchTransport({
  baseUrl: "http://localhost:8080/twirp"
})
const client = new SandboxClient(transport)

export const codeRouter = createRouter().mutation("run", {
  input: z.object({
    language: z.nativeEnum(Languages),
    code: z.string()
  }),
  async resolve({ input: { language, code } }) {
    const rpcCall = await client.runCode({ code, language })

    return rpcCall.response.result
  }
})
