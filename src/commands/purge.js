const { GuildMember } = require('discord.js')

const Command = require('../Command')

module.exports = new Command({
  name: 'purge',
  description: 'Delete the last messages in all chats.',
  permission: 'MANAGE_MESSAGES',
  async run(message, args, client, player) {
    const amount = args[1]

    if (!amount || isNaN(amount))
      return message.reply(
        `${amount == undefined ? 'Nothing' : amount} is not a valid number!`
      )

    const amountParsed = parseInt(amount)

    if (amountParsed > 100)
      return message.reply('You cannot clear more than 100 messages!')

    message.channel.bulkDelete(amountParsed)

    await message.channel.send(`Cleared ${amountParsed} messages!`)
  },
})
