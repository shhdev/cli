import fs from 'fs'

const ignoreContent = `
# shh
.shh
`

const ignoreCheck = () => {
  const gitignore = '.gitignore'
  const ignoreExists = fs.existsSync(gitignore)

  if (!ignoreExists) {
    fs.writeFileSync(gitignore, ignoreContent)
  } else {
    const file = fs.readFileSync(gitignore)

    if (!file.includes(ignoreContent)) {
      fs.appendFileSync(gitignore, ignoreContent)
    }
  }
}

export default ignoreCheck
