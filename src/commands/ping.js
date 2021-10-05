const Command = require('../Command')

module.exports = new Command({
  name: 'ping',
  description: 'Show the ping of the bot.',
  permission: 'SEND_MESSAGES',
  async run(message, args, client, player) {
    const msg = await message.reply(`Ping: ${client.ws.ping} ms.`)
    msg.edit(
      `Ping: ${client.ws.ping} ms.\nMessage Ping: ${
        msg.createdTimestamp - message.createdTimestamp
      } ms.`
    )
  },
})
