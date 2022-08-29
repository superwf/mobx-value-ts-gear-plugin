import { getDefaultValueByType } from './getDefaultValueByType'
import { stringToSourceFile } from './stringToSourceFile'

test('getDefaultValueByType', () => {
  expect(getDefaultValueByType()).toBe('{}')

  const source = stringToSourceFile(`
type A = {[p: string]: any};
type B = boolean;
type C = number;
type D = 'a' | 'b';
type E = null;
type F = undefined;
type G = string | number;
`)

  const assertBoolean = jest.fn()
  const assertNumber = jest.fn()
  const assertString = jest.fn()
  const assertNull = jest.fn()
  const assertUndefined = jest.fn()
  const assertUnion1 = jest.fn()
  const assertUnion2 = jest.fn()
  const assertDefaut = jest.fn()
  source.forEachDescendant(n => {
    const t = n.getType()
    if (t.isBoolean()) {
      assertBoolean()
      expect(getDefaultValueByType(n.getType())).toBe('true')
    } else if (t.isNumber()) {
      assertNumber()
      expect(getDefaultValueByType(n.getType())).toBe('0')
    } else if (t.isString()) {
      assertString()
      expect(getDefaultValueByType(n.getType())).toBe('""')
    } else if (t.isUndefined()) {
      assertUndefined()
      expect(getDefaultValueByType(n.getType())).toBe('undefined')
    } else if (t.isNull()) {
      assertNull()
      expect(getDefaultValueByType(n.getType())).toBe('null')
    } else if (t.isUnion()) {
      if (t.getUnionTypes()[0].getText() === 'string') {
        assertUnion1()
        expect(getDefaultValueByType(n.getType())).toBe('""')
      }
      if (t.getUnionTypes()[0].isLiteral()) {
        assertUnion2()
        expect(getDefaultValueByType(n.getType())).toBe('"a"')
      }
    } else {
      assertDefaut()
      expect(getDefaultValueByType(n.getType())).toBe('{}')
    }
  })

  expect(assertBoolean).toHaveBeenCalled()
  expect(assertNumber).toHaveBeenCalled()
  expect(assertString).toHaveBeenCalled()
  expect(assertNull).toHaveBeenCalled()
  expect(assertUndefined).toHaveBeenCalled()
  expect(assertUnion1).toHaveBeenCalled()
  expect(assertUnion2).toHaveBeenCalled()
  expect(assertDefaut).toHaveBeenCalled()
})
