import type { SourceFile } from 'ts-morph'
import { SyntaxKind } from 'ts-morph'
import { getDefaultValueByType } from './getDefaultValueByType'
import type { CollectRequestResult } from './type'

export const collectRequestName = (requestSourceFile: SourceFile): CollectRequestResult => {
  const requestFunctionNames: string[] = []
  const returnTypeNames: string[] = []
  const defaultValues: string[] = []

  requestSourceFile.forEachChild(n => {
    if (n.getKind() === SyntaxKind.VariableStatement) {
      const syntaxList = n.getLastChildByKind(SyntaxKind.VariableDeclarationList)
      if (syntaxList) {
        const identifier = syntaxList.getDeclarations()[0]
        const name = identifier.getName()
        requestFunctionNames.push(name)
      }

      const reqFun = n.getFirstDescendantByKind(SyntaxKind.FunctionDeclaration)
      const returnPromiseType = reqFun?.getLastChildByKind(SyntaxKind.TypeReference)
      const returnType = returnPromiseType?.getFirstDescendantByKind(SyntaxKind.TypeReference)
      const rType = returnType?.getType()
      // console.log('----------', rType?.getText())

      const defaultValue = getDefaultValueByType(rType)
      defaultValues.push(defaultValue)
      returnTypeNames.push(rType?.getText() || 'any')
    }
  })
  return {
    requestFunctionNames,
    returnTypeNames,
    defaultValues,
  }
}
