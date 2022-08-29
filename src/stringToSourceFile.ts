import { TS_PROJECT } from './constant'

let virtualFileNameId = 0
export const stringToSourceFile = (content?: string) => {
  const name = `file${(virtualFileNameId += 1)}.ts`
  const sourceFile = TS_PROJECT.createSourceFile(name, content)
  ;(sourceFile as any).$$fileName = name
  return sourceFile
}
