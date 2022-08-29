export type Option = {
  /**
   * output file path
   * @example "src/request/req.ts"
   * */
  output: string
  /**
   * how to generate your mobx-value request var
   * the param is requestFunctionName generate by ts-gear
   * */
  generateRequestVarName?: (requestFunctionName: string) => string

  /**
   * where the output and service dir is based
   * @default "src"
   * */
  baseDir?: string
}

export type CollectRequestResult = {
  requestFunctionNames: string[]
  returnTypeNames: string[]
  defaultValues: string[]
}
