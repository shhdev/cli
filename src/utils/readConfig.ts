import fs from 'fs'

import chalk from 'chalk'
import yaml from 'js-yaml'

import type { ShhConfig } from '../utils/configOptions'

const templateConfig = `
apiKey:
email:
secretKey:
envs:
  - fileName:
`

const readConfig = async (fileName: string, template?: boolean) => {
  let configFile: string

  if (!fs.existsSync(fileName)) {
    if (!template) {
      console.log(chalk.red(`Could not find ${fileName} file`))
      process.exit()
    }

    console.log(
      chalk.yellow(
        `Could not find ${fileName} file. Using default template config...`
      )
    )
    configFile = templateConfig
  } else {
    console.log(chalk.green(`Reading from ${fileName}...`))

    configFile = fs.readFileSync(fileName).toString()
  }

  const config = yaml.load(configFile) as ShhConfig

  return config
}

export default readConfig
