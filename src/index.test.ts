import fs from 'fs'
import path from 'path'
import temp from 'temp'
import { upperFirst } from 'lodash'
import type { Project } from 'ts-gear'
import type { Option } from './type'
import { resolveRoot } from './tool'
import { mobxValueTsGearPlugin } from './index'

test('use beforeWriteTs hook', async () => {
  expect(true).toBe(true)
  const tempDir = await temp.mkdir('tempForTest')
  const output = path.join(tempDir, 'output.ts')
  const option: Option = {
    output,
  }

  const requestFileContent = fs.readFileSync(resolveRoot('fixture/petv3/request.ts'), { encoding: 'utf8' })

  const project: Project = {
    name: 'petv3',
    dest: 'service',
    source: 'https://petstore3.swagger.io/api/v3/openapi.json',
    importRequesterStatement: 'import { requester } from "../../requester"',
    // simplifyRequestOption: true,
    shouldGenerateMock: true,
    EOL: '\n',
    withBasePath: true,
    requestOptionUnionType: 'RequestInit',
  }

  await mobxValueTsGearPlugin(option).beforeWriteTs!({
    requestFileContent,
    requestFile: '',
    definitionFile: '',
    definitionFileContent: '',
    mockRequestFile: '',
    mockRequestFileContent: '',
    indexFile: '',
    indexFileContent: '',
    project,
  })
  const result = fs.readFileSync(output, { encoding: 'utf8' })
  expect(result).toMatchSnapshot()
  temp.cleanupSync()
})

test('transformRequestFunctionName', async () => {
  expect(true).toBe(true)
  const tempDir = await temp.mkdir('tempForTest')
  const output = path.join(tempDir, 'output.ts')
  const option: Option = {
    output,
    transformRequestFunctionName(reqFuncName) {
      return `mobx${upperFirst(reqFuncName)}`
    },
  }

  const requestFileContent = fs.readFileSync(resolveRoot('fixture/petv3/request.ts'), { encoding: 'utf8' })

  const project: Project = {
    name: 'petv3',
    dest: 'service',
    source: 'https://petstore3.swagger.io/api/v3/openapi.json',
    importRequesterStatement: 'import { requester } from "../../requester"',
    // simplifyRequestOption: true,
    shouldGenerateMock: true,
    EOL: '\n',
    withBasePath: true,
    requestOptionUnionType: 'RequestInit',
  }

  await mobxValueTsGearPlugin(option).beforeWriteTs!({
    requestFileContent,
    requestFile: '',
    definitionFile: '',
    definitionFileContent: '',
    mockRequestFile: '',
    mockRequestFileContent: '',
    indexFile: '',
    indexFileContent: '',
    project,
  })
  const result = fs.readFileSync(output, { encoding: 'utf8' })
  // console.log(result)
  expect(result).toMatchSnapshot()
  temp.cleanupSync()
})
