import type { PositionalOptionsType } from 'yargs'

interface GlobalConfig {
  apiKey?: string
  cascade?: boolean
  email?: string
  exports?: boolean
  secretKey?: string
  variables?: {
    [key: string]: string
  }
}

interface EnvironmentConfig extends GlobalConfig {
  fileName: string
  slug?: string
}

export interface ShhConfig extends GlobalConfig {
  host?: string
  envs: EnvironmentConfig[]
}

const configOptions: {
  name: string
  description: string
  alias?: string
  type: 'array' | 'count' | PositionalOptionsType
  inputType?: string
  default?: unknown
}[] = [
  {
    name: 'apiKey',
    description: `User's project API key`,
    alias: 'k',
    type: 'string',
  },
  {
    name: 'cascade',
    description: 'Cascading removes duplicate key values in the output file',
    type: 'boolean',
    inputType: 'checkbox',
    default: true,
  },
  {
    name: 'email',
    description: 'User account email address',
    alias: 'e',
    type: 'string',
  },
  {
    name: 'exports',
    description: 'Environment variables should be exports',
    alias: 'x',
    type: 'boolean',
    inputType: 'checkbox',
    default: false,
  },
  {
    name: 'host',
    description: 'Hostname of shh.dev instance',
    alias: 'h',
    type: 'string',
    default: 'shh.dev',
  },
  {
    name: 'secretKey',
    description: `Project's secret key used to encrypt/decrypt`,
    alias: 's',
    type: 'string',
  },
]

export default configOptions
