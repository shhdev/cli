import chalk from 'chalk'
import { fetch } from 'cross-undici-fetch'
import { Argv } from 'yargs'

import { assignDefined, configOptions, ignoreCheck, readConfig } from '../utils'
import type { ShhConfig } from '../utils/configOptions'

export const command = 'pull [options..]'
export const description = 'Pull environment file'

export const builder = (yargs: Argv) => {
  configOptions.forEach((option) => {
    yargs.option(option.name, {
      alias: option.alias,
      describe: option.description,
      default: option.default,
      type: option.type,
    })
  })
}

const query = `
  query GetFile($apiKey: String!, $email: String!, $fileName: String!) {
    file: getFile(apiKey: $apiKey, email: $email, fileName: $fileName) {
      name
      groups {
        name
        description
        variables {
          key
          value
          private
        }
      }
      includes {
        name
        groups {
          name
          description
          variables {
            key
            value
            private
          }
        }
      }
    }
  }
`

export const handler = async (options: Record<string, unknown>) => {
  ignoreCheck()

  const config = await readConfig('.shh')

  for (const key of Object.keys(options)) {
    const val = options[key] as never
    if (val !== undefined) {
      config[key as keyof ShhConfig] = val
    }
  }

  const { envs, variables, ...rest } = config

  let apiUrl = 'http'

  const host = config.host || 'shh.dev'

  if (!host.startsWith('localhost')) {
    apiUrl += 's'
  }

  apiUrl += `://${host}/.redwood/functions/graphql`

  for (let i = 0; i < envs.length; i++) {
    const env = envs[i]

    const { variables: envVariables, ...envRest } = env

    console.log(env)

    const envConfig = {
      ...rest,
      ...envRest,
      variables: {
        ...variables,
        ...envVariables,
      },
    }

    console.log(envConfig)

    const required = ['apiKey', 'email', 'secretKey']

    for (const [key, value] of Object.entries(config)) {
      if (required.includes(key) && !value && value !== false) {
        console.log(chalk.red(`Missing ${key} value for env ${i}`))
        process.exit()
      }
    }

    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query,
    //     variables: {
    //       apiKey: envConfig.apiKey,
    //       email: envConfig.email,
    //       fileName: envConfig.fileName,
    //     },
    //   }),
    // })

    // const json = await response.json()

    // console.log(json)
  }
}
