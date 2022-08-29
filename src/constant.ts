import { Project, ScriptTarget } from 'ts-morph'
import { upperFirst } from 'lodash'

export const DEFAULT_REQUEST_VAR_NAME = (name: string) => `request${upperFirst(name)}`

export const TS_PROJECT = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: {
    target: ScriptTarget.ESNext,
  },
})
