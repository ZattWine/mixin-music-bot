const { GuildMember } = require('discord.js')

const Command = require('../Command')

module.exports = new Command({
  name: 'queue',
  description: 'View the queue of current songs.',
  permission: 'SEND_MESSAGES',
  async run(message, args, client, player) {
    let voiceChannel = message.member.voice.channel

    if (!(message.member instanceof GuildMember) || !voiceChannel) {
      return void message.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      })
    }

    if (
      message.guild.me.voice.channelId &&
      message.member.voice.channelId !== message.guild.me.voice.channelId
    ) {
      return void message.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      })
    }

    const queue = player.getQueue(message.guildId)
    if (typeof queue != 'undefined') {
      trimString = (str, max) =>
        str.length > max ? `${str.slice(0, max - 3)}...` : str

      return void message.reply({
        embeds: [
          {
            title: 'Now Playing',
            description: trimString(
              `The Current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | **${queue}**! `,
              4095
            ),
          },
        ],
      })
    } else {
      return void message.reply({
        content: 'There is no song in the queue!',
      })
    }
  },
})
