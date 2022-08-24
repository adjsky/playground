// src/server/router/index.ts
import { createRouter } from "./context"
import superjson from "superjson"

import { codeRouter } from "./code"
import { protectedExampleRouter } from "./protected-example"

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("code.", codeRouter)
  .merge("question.", protectedExampleRouter)

// export type definition of API
export type AppRouter = typeof appRouter
