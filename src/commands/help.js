const fs = require('fs')

const Command = require('../Command')

module.exports = new Command({
  name: 'help',
  description: 'List of all available commands.',
  permission: 'SEND_MESSAGES',
  async run(message, args, client, player) {
    let str = ''
    const commandFiles = fs
      .readdirSync('./src/commands')
      .filter((file) => file.endsWith('.js'))

    let i = 1
    for (const file of commandFiles) {
      const command = require(`./${file}`)
      str += `${i}: \`,${command.name}\`, ${command.description} \n`
      i++
    }

    message.reply({
      content: str,
      ephemeral: true,
    })
  },
})
