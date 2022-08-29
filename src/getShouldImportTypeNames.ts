import { SyntaxKind } from 'ts-morph'
import { stringToSourceFile } from './stringToSourceFile'

const primativeTypes = ['any', 'number', 'string', 'boolean']

export const getShouldImportTypeNames = (typeNames: string[]): string[] =>
  typeNames.reduce((r, t) => {
    if (primativeTypes.includes(t)) {
      return r
    }
    if (/^[a-z]+$/i.test(t)) {
      r.push(t)
    } else {
      const tempName = '_Temp'
      const source = stringToSourceFile(`type ${tempName} = ${t}`)
      source.forEachDescendant(node => {
        if (node.getKind() === SyntaxKind.Identifier) {
          const identiferName = node.getText()
          if (![tempName, 'Array', 'Record'].includes(identiferName) && /^[A-Z][a-z0-9]+/.test(identiferName)) {
            r.push(node.getText())
          }
        }
      })
    }
    return r
  }, [] as string[])
