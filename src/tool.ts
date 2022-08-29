import path from 'path'

export const resolveRoot = (...paths: string[]) => path.resolve(process.cwd(), ...paths)
