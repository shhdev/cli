import fs from 'fs'

import chalk from 'chalk'
import inquirer, { DistinctQuestion } from 'inquirer'
import _ from 'lodash'
import type { Argv } from 'yargs'

import { configOptions, ignoreCheck, readConfig, writeConfig } from '../utils'

export const command = 'init [options..]'
export const description = 'Create .shh config file'

export const builder = (args: Argv) => {
  args.option('force', {
    alias: 'f',
    describe: 'Forcibly overwrite existing config file',
    default: false,
    type: 'boolean',
  })
}

export const handler = async (options: Record<string, unknown>) => {
  ignoreCheck()

  const configExists = fs.existsSync('.shh')

  if (configExists) {
    if (options.force) {
      console.log(chalk.yellow('Overwriting existing .shh file...'))
    } else {
      console.log(
        chalk.red(
          '.shh file already exists. Try running the command again with -f to overwrite the existing file.'
        )
      )
      process.exit()
    }
  } else {
    console.log(chalk.green('Creating .shh file from template...'))
  }

  const config = await readConfig('.shh.template', true)

  const questions: DistinctQuestion[] = []

  const fillBlanks = (obj: object, space?: string) => {
    const namespace = space ? space + '.' : ''

    for (const [key, value] of Object.entries(obj)) {
      const keyName = `${namespace}${key}`

      // single values
      if (value === null) {
        const option = configOptions.find((o) => o.name === key)

        questions.push({
          type:
            (option?.inputType as
              | 'number'
              | 'input'
              | 'password'
              | 'list'
              | 'expand'
              | 'checkbox'
              | 'confirm'
              | 'editor'
              | 'rawlist') || 'input',
          name: encodeURIComponent(keyName),
          message: option?.description
            ? `${keyName}: ${option.description}`
            : keyName,
          default: option?.default,
        })
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const obj = value[i]

          fillBlanks(obj, `${keyName}[${i}]`)
        }
      } else if (typeof value === 'object') {
        fillBlanks(value, keyName)
      }
    }
  }

  fillBlanks(config)

  if (questions.length > 0) {
    await inquirer.prompt(questions).then((answers) => {
      for (const [key, value] of Object.entries(answers)) {
        _.set(config, decodeURIComponent(key), value)
      }
    })
  }

  writeConfig(config)
}
