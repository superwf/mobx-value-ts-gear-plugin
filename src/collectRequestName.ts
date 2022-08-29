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
      const returnTypeRef = returnPromiseType?.getFirstDescendantByKind(SyntaxKind.TypeReference)
      const returnType = returnTypeRef?.getType()
      // console.log('----------', returnType?.getText())

      const defaultValue = getDefaultValueByType(returnType)
      defaultValues.push(defaultValue)
      returnTypeNames.push(returnType?.getText() || 'any')
    }
  })
  return {
    requestFunctionNames,
    returnTypeNames,
    defaultValues,
  }
}
