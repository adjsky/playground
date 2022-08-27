import { useState } from "react"
import Editor from "@monaco-editor/react"

import { trpc } from "@/utils/trpc"
import { Languages } from "@/protos/sandbox"

import type { NextPage } from "next"

const Home: NextPage = () => {
  const [code, setCode] = useState("")

  const codeRunMutation = trpc.useMutation(["code.run"], {
    onSettled: (data) => {
      console.log(data)
    }
  })

  return (
    <>
      <div className="flex w-full justify-center">
        <button
          className="rounded-lg bg-indigo-800 py-2 px-4 text-yellow-100"
          onClick={() => {
            codeRunMutation.mutate({ language: Languages.JAVASCRIPT, code })
          }}
          disabled={codeRunMutation.isLoading || code == ""}
        >
          {codeRunMutation.isLoading ? "Loading..." : "Run"}
        </button>
      </div>

      <Editor
        height="100vh"
        language="typescript"
        value={code}
        onChange={(value) => setCode(value ?? "")}
      />
    </>
  )
}

export default Home
