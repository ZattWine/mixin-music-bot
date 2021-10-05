const Event = require('../Event')

module.exports = new Event('ready', (client) => {
  console.log('🚀 Mixin music bot is now online!')
})
