# mobx-value-ts-gear-plugin

## mobx-value for ts-gear plugin

## Install

```sh
npm i mobx-value-ts-gear-plugin
// or
yarn add mobx-value-ts-gear-plugin
```

## How to use in code

In your ts-gear config file, for example `src/tsg.config.ts`

```typescript
import type { Project } from 'ts-gear'
import { mobxValueTsGearPlugin } from 'mobx-value-ts-gear-plugin'

const projects: Project[] = [
  {
    name: 'service1',
    dest,
    source: 'http://your-api/v3/api-docs',
    importRequesterStatement: 'import { requester } from "../../fetchInterceptor/requester"',
    keepGeneric: false,
    hooks: mobxValueTsGearPlugin({
      output: resolveRoot('src/request/service1.ts'),
    }),
  },
]
```

## Option

see [Option](https://github.com/superwf/mobx-value-ts-gear-plugin/blob/master/src/type.ts)
