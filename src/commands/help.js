const fs = require('fs')

const Command = require('../Command')

module.exports = new Command({
  name: 'help',
  description: 'List of all available commands.',
  permission: 'SEND_MESSAGES',
  async run(message, args, client, player) {
    let str = ''
    const commandFiles = fs
      .readdirSync('../commands')
      .filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`./${file}`)
      str += `Name: ${command.name}, Description: ${command.description} \n`
    }

    message.reply({
      content: str,
      ephemeral: true,
    })
  },
})
