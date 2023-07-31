'use strict';

import { config } from 'dotenv'
config()
import { config as phoneNumberInitializer } from '@jaood/phone-numbers'
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import createHTML from './static.js'

const DATA_URL = process.env.CONFIG_DATA_URL
const SERVER_URL = process.env.SERVER_URL || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || '8080'

function onClose() {
  console.log('terminating...')
  setTimeout(() => server.close(), 1000)
}

process.once('SIGINT', onClose)
process.once('SIGTERM', onClose)
process.once('unhandledRejection', onClose)
process.once('uncaughtException', onClose)

if (!DATA_URL) throw new Error('No config data url specified')
const data = await fetch(DATA_URL, { method: 'POST' })
  .then((data) => data.json())

const utils = phoneNumberInitializer(data)
const html = createHTML(SERVER_ADDRESS)

function parseParams(input) {
  const params = input.split('&')
  const obj = {}
  for (const param of params) {
    const [key, value] = param.split('=')
    obj[key] = value
  }
  return obj
}

const server = createServer((req, res) => {
  const { url } = req
  const query = url.slice(2)
  if (query === '') {
    return res.end(html)
  }
  const decoded = decodeURIComponent(query)
  const { phone, ISO } = parseParams(decoded)
  console.log({ url, query, phone, ISO })
  if (!phone) return res.end('No phone provided')
  if (!ISO) return res.end('No ISO country provided')
  let response;
  try {
    const operator = utils.recognizeOperator(phone, ISO)
    const formattedPhone = utils.formatPhone(phone, ISO)
    response = `${operator}: ${formattedPhone}`
  } catch ({ message }) {
    response = message
  }
  res.end(response)
})

server.listen(SERVER_PORT)
