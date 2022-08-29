import type { Project } from 'ts-gear'
import type { Option } from './type'
import { prettyWriteFile } from './prettyWriteFile'
import { stringToSourceFile } from './stringToSourceFile'
import { collectRequestName } from './collectRequestName'
import { generateStoreSourceFile } from './generateStoreSourceFile'

export const mobxValueTsGearPlugin = (option: Option): Exclude<Project['hooks'], undefined> => ({
  async beforeWriteTs({ requestFileContent, project }) {
    const requestSource = stringToSourceFile(requestFileContent)
    const collectResult = collectRequestName(requestSource)

    const result = generateStoreSourceFile({ option, project, collectResult })
    prettyWriteFile({ file: option.output, data: result })
    return Promise.resolve()
  },
})
