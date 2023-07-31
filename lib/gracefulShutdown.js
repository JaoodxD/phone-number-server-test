export default function gracefulShutdown(callback) {
  function onClose(error) {
    if (error) console.error(error)
    console.log('terminating...')
    setTimeout(callback, 500)
  }

  process.once('SIGINT', onClose)
  process.once('SIGTERM', onClose)
  process.once('unhandledRejection', onClose)
  process.once('uncaughtException', onClose)
}
