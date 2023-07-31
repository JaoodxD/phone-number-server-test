export default function createHTML (url) {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  
  <body>
    <input type="text" name="phone" id="phone" alt="phone">
    <input type="text" name="country" id="country" alt="country">
    <label id="output"></label>
    <script>
      const phoneInput = document.querySelector('#phone')
      const countryInput = document.querySelector('#country')
      const outputLabel = document.querySelector('#output')
      const url = '${url}'
      const debounced = debounce(makeRequest, 500)
      phoneInput.addEventListener('input', debounced)
      countryInput.addEventListener('input', debounced)
  
      function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
          clearTimeout(timer)
          timer = setTimeout(() => { func.apply(this, args); }, timeout)
        }
      }
      async function makeRequest() {
        const phone = phoneInput.value
        const country = countryInput.value
        const request = \`\${url}/?phone=\${phone}&ISO=\${country}\`
  const result = await fetch(request).then((data) => data.text())
  outputLabel.textContent = result
}
    </script >
  </body >
  
  </html >
  `
}
