import { useState } from "react"
import Editor from "@monaco-editor/react"
import clsx from "clsx"

import { trpc } from "@/utils/trpc"
import { Languages } from "@/protos/sandbox"
import {
  editorLanguageNames,
  visibleLanguageNames
} from "@/protos/supported-languages"

import type { NextPage } from "next"

const Home: NextPage = () => {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState(Languages.TYPESCRIPT)

  const codeRunMutation = trpc.useMutation(["code.run"])

  return (
    <>
      <main className="grid h-screen grid-cols-[auto_1fr_1fr]">
        <section id="languages" className="flex flex-col gap-3 p-2">
          {Object.values(Languages).map((value) => {
            if (typeof value == "string") {
              return
            }

            return (
              <button
                key={value}
                onClick={() => setLanguage(value)}
                className={clsx(
                  "h-[30px] w-[30px] border border-zinc-400",
                  language == value && "border-zinc-900 bg-slate-400"
                )}
              >
                {value}
              </button>
            )
          })}
        </section>
        <section id="editor" className="h-full grid-rows-[auto_1fr]">
          <header className="flex items-center gap-4">
            <button
              className="rounded-lg bg-indigo-800 py-2 px-4 text-yellow-100"
              onClick={() => {
                codeRunMutation.mutate({ language, code })
              }}
              disabled={codeRunMutation.isLoading || code == ""}
            >
              {codeRunMutation.isLoading ? "Loading..." : "Run"}
            </button>
            <span>Current language: {visibleLanguageNames[language]}</span>
          </header>
          <Editor
            height="calc(100vh - 40px)"
            language={editorLanguageNames[language]}
            value={code}
            onChange={(value) => setCode(value ?? "")}
          />
        </section>
        <section id="output">
          <header>
            <button
              className="rounded-lg bg-indigo-800 py-2 px-4 text-yellow-100"
              onClick={codeRunMutation.reset}
            >
              Clear
            </button>
          </header>
          <div
            dangerouslySetInnerHTML={{ __html: codeRunMutation.data ?? "" }}
          />
        </section>
      </main>
    </>
  )
}

export default Home
