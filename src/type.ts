export type Option = {
  output: string
  generateRequestVarName?: (name: string) => string
  baseDir?: string
}
