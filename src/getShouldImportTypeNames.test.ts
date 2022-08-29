import { getShouldImportTypeNames } from './getShouldImportTypeNames'

test('getShouldImportTypeNames', () => {
  expect(getShouldImportTypeNames(['any'])).toEqual([])
  expect(getShouldImportTypeNames(['number', 'boolean', 'string'])).toEqual([])
  expect(getShouldImportTypeNames(['boolean', 'Pet'])).toEqual(['Pet'])

  expect(getShouldImportTypeNames(['boolean', 'Pet[]'])).toEqual(['Pet'])
  expect(getShouldImportTypeNames(['boolean', 'Array<Pet>'])).toEqual(['Pet'])
  expect(getShouldImportTypeNames(['boolean', '{ [p: string]: Pet }'])).toEqual(['Pet'])
})
