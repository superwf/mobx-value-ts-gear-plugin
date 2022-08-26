import type { Type } from 'ts-morph'

export const getDefaultValueByType = (type?: Type): string => {
  if (!type) {
    return '{}'
  }
  if (type.isUnion()) {
    return type.getUnionTypes()[0].getText()
  }
  const t = type.getText()
  if (t === 'boolean') {
    return 'true'
  }
  if (t === 'string') {
    return '""'
  }
  if (t === 'number') {
    return '0'
  }

  return '{}'
}
