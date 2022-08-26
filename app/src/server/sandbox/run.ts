import shell from "shelljs"
import { nanoid } from "nanoid"
import path from "path"
import os from "os"
import { writeFile, mkdir, rm } from "fs/promises"

import type { SupportedLanguages } from "@/data/supported-languages"

const filename = {
  javascript: "index.js",
  typescript: "index.ts"
}

const environmentExec = {
  javascript: `npm init -y`,
  typescript: `npm init -y`
}

const scriptExec = {
  javascript: `node ${filename["javascript"]}`,
  typescript: `ts-node ${filename["typescript"]} -O '{"isolatedModules": false}'`
}

const run = async (lang: SupportedLanguages, code: string): Promise<string> => {
  const prevCWD = process.cwd()
  const dirName = `sandbox-${lang}-${nanoid()}`
  const dirPath = path.join(os.tmpdir(), dirName)

  await mkdir(dirPath)
  await writeFile(path.join(dirPath, filename[lang]), code)
  shell.cd(dirPath)
  shell.exec(environmentExec[lang], { silent: true })

  const result = shell.exec(scriptExec[lang])

  // clean up
  await rm(dirPath, { recursive: true })
  shell.cd(prevCWD)

  return result.code == 0 ? result.stdout : result.stderr
}

export default run
