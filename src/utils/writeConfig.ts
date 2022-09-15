import fs from 'fs'

import chalk from 'chalk'
import yaml from 'js-yaml'

import type { ShhConfig } from '../utils/configOptions'

const writeConfig = (config: ShhConfig) => {
  const content = yaml.dump(config)

  fs.writeFileSync('.shh', content)

  console.log(chalk.green('New .shh file created!'))
}

export default writeConfig
