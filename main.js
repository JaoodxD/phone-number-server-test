'use strict'

import { config } from 'dotenv'
config()
import { config as phoneNumberInitializer } from '@jaood/phone-numbers'
import { createServer } from 'node:http'
import createHTML from './lib/static.js'
import parseParams from './lib/parseParams.js'
import gracefulShutdown from './lib/gracefulShutdown.js'
import getConfig from './lib/getConfig.js'

const DATA_URL = process.env.CONFIG_DATA_URL
const SERVER_URL = process.env.SERVER_URL || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || '8080'
const SERVER_ADDRESS = `${SERVER_URL}:${SERVER_PORT}`

if (!DATA_URL) throw new Error('No config data url specified')
const data = await getConfig(DATA_URL)
const utils = phoneNumberInitializer(data)
const html = createHTML(SERVER_ADDRESS)

const routes = {
  'static': () => html,
  'libExec': (query) => {
    const decoded = decodeURIComponent(query)
    const { phone, ISO } = parseParams(decoded)
    if (!phone) return 'No phone provided'
    if (!ISO) return 'No ISO country provided'
    try {
      const operator = utils.recognizeOperator(phone, ISO)
      const formattedPhone = utils.formatPhone(phone, ISO)
      const response = `${operator}: ${formattedPhone}`
      return response
    } catch ({ message }) {
      return message
    }
  }
}

const server = createServer((req, res) => {
  const { url } = req
  console.log({ url })
  const query = url.slice(2)
  const handler = query === '' ? routes.static : routes.libExec
  const response = handler(query);
  res.end(response)
})

gracefulShutdown(() => server.close())

server.listen(SERVER_PORT)
