import { uniq } from 'lodash'
import type { Project } from 'ts-gear'
import type { SourceFile } from 'ts-morph'
import { Project as TSProject, ScriptTarget, VariableDeclarationKind, SyntaxKind } from 'ts-morph'
import { getDefaultValueByType } from './getDefaultValueByType'
import type { Option } from './type'
import { DEFAULT_REQUEST_VAR_NAME } from './constant'
import { prettyWriteFile } from './prettyWriteFile'

export const genStoreCode = ({ output, generateRequestVarName, baseDir }: Option): Project['hooks'] => ({
  async beforeWriteTs({ requestFileContent, project }) {
    // console.log(requestFileContent)
    const tsProject = new TSProject({
      useInMemoryFileSystem: true,
      compilerOptions: {
        target: ScriptTarget.ESNext,
      },
    })
    const fs = tsProject.getFileSystem()

    let virtualFileNameId = 0
    /** get SourceFile */
    const sow = (content?: string) => {
      const name = `file${(virtualFileNameId += 1)}.ts`
      const sourceFile = tsProject.createSourceFile(name, content)
      ;(sourceFile as any).$$fileName = name
      return sourceFile
    }
    const requestSource = sow(requestFileContent)
    const requestFunctionNames: string[] = []
    const returnTypeNames: string[] = []
    const defaultValues: string[] = []

    requestSource.forEachChild(n => {
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

        const defaultValue = getDefaultValueByType(rType)
        defaultValues.push(defaultValue)
        returnTypeNames.push(rType?.getText() || 'any')
      }
    })

    const storeSource = sow()
    storeSource.addImportDeclaration({
      namedImports: ['request'],
      moduleSpecifier: 'src/mobx6',
    })
    const shouldImportReturnTypeNames = returnTypeNames.filter(t => !['any', 'number', 'string', 'boolean'].includes(t))
    storeSource.addImportDeclaration({
      namedImports: uniq([...requestFunctionNames, ...shouldImportReturnTypeNames]),
      moduleSpecifier: `${baseDir || 'src'}/${project.dest}/${project.name}`,
    })
    requestFunctionNames.forEach((functionName, i) => {
      const name = (generateRequestVarName || DEFAULT_REQUEST_VAR_NAME)(functionName)

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
        })
        .appendWhitespace(w => w.newLine())
    })

    /** remove SourceFile and get typescript content */
    const harvest = (sourceFile: SourceFile) => {
      sourceFile.saveSync()
      const result = fs.readFileSync((sourceFile as any).$$fileName)
      sourceFile.deleteImmediatelySync()
      tsProject.removeSourceFile(sourceFile)
      return result
    }

    const result = harvest(storeSource)
    prettyWriteFile({ file: output, data: result })
    return Promise.resolve()
  },
})
