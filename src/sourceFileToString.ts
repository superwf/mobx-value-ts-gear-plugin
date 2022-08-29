import type { SourceFile } from 'ts-morph'
import { TS_PROJECT } from './constant'

const fs = TS_PROJECT.getFileSystem()

export const sourceFileToString = (sourceFile: SourceFile) => {
  sourceFile.saveSync()
  const result = fs.readFileSync((sourceFile as any).$$fileName)
  sourceFile.deleteImmediatelySync()
  TS_PROJECT.removeSourceFile(sourceFile)
  return result
}
