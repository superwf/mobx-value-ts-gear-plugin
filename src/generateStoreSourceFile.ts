import { VariableDeclarationKind } from 'ts-morph'
import { uniq } from 'lodash'
import type { Project } from 'ts-gear'
import { DEFAULT_REQUEST_VAR_NAME } from './constant'
import { stringToSourceFile } from './stringToSourceFile'
import type { CollectRequestResult, Option } from './type'
import { sourceFileToString } from './sourceFileToString'
import { getShouldImportTypeNames } from './getShouldImportTypeNames'

export const generateStoreSourceFile = ({
  option: { baseDir, transformRequestFunctionName },
  project,
  collectResult: { requestFunctionNames, returnTypeNames, defaultValues },
}: {
  option: Option
  project: Project
  collectResult: CollectRequestResult
}): string => {
  const storeSource = stringToSourceFile()
  storeSource.addImportDeclaration({
    namedImports: ['request'],
    moduleSpecifier: 'mobx-value',
  })
  const shouldImportReturnTypeNames = getShouldImportTypeNames(returnTypeNames)
  storeSource.addImportDeclaration({
    namedImports: uniq([...requestFunctionNames, ...shouldImportReturnTypeNames]),
    moduleSpecifier: `${baseDir || 'src'}/${project.dest}/${project.name}`,
  })
  requestFunctionNames.forEach((functionName, i) => {
    const name = (transformRequestFunctionName || DEFAULT_REQUEST_VAR_NAME)(functionName)

    storeSource
      .addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name,
            initializer: `request({
    request: ${functionName},
    value: ${defaultValues[i]} as ${returnTypeNames[i]}
    })`,
          },
        ],
        // docs: [`auto generated ${name} by mobx-value-ts-gear-plugin`],
      })
      .appendWhitespace(w => {
        w.newLine()
      })
  })
  return sourceFileToString(storeSource)
}
