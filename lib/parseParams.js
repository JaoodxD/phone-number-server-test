export default function parseParams (input) {
  const params = input.split('&')
  const obj = {}
  for (const param of params) {
    const [key, value] = param.split('=')
    obj[key] = value
  }
  return obj
}
