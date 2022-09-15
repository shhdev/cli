const assignDefined = (
  target: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
) => {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const val = source[key]
      if (val !== undefined) {
        target[key] = val
      }
    }
  }
  return target
}
export default assignDefined
