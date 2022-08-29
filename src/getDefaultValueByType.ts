import type { Type } from 'ts-morph'

export const getDefaultValueByType = (type?: Type): string => {
  if (!type) {
    return '{}'
  }
  if (type.isBoolean()) {
    return 'true'
  }
  if (type.isString()) {
    return '""'
  }
  if (type.isNumber()) {
    return '0'
  }
  if (type.isNull()) {
    return 'null'
  }
  if (type.isUndefined()) {
    return 'undefined'
  }
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes()
    if (unionTypes.length > 0) {
      if (unionTypes[0].isLiteral()) {
        return unionTypes[0].getText()
      }
    }
    return getDefaultValueByType(unionTypes[0])
  }

  return '{}'
}
