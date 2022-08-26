import { writeFileSync } from 'fs'
import type { Options } from 'prettier'
import { format } from 'prettier'

/**
 * read from tsg config project prettier config
 * write formatted typescript data
 * */
export const prettyWriteFile = ({ file, data, option }: { file: string; data: string; option?: Options }) => {
  writeFileSync(
    file,
    format(data, {
      ...option,
      parser: 'typescript',
    }),
    { encoding: 'utf8' },
  )
}
