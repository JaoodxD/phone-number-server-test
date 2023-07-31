export default async function getConfig (url, method = 'POST') {
  const data = await fetch(url, { method })
  const json = await data.json()
  return json
}
