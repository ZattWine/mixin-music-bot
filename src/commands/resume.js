const { GuildMember } = require('discord.js')

const Command = require('../Command')

module.exports = new Command({
  name: 'resume',
  description: 'Resume current song.',
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
    if (!queue || !queue.playing)
      return void message.reply({
        content: '❌ | No music is being played!',
      })

    const success = queue.setPaused(false)
    return void message.reply({
      content: success ? '▶ | Resumed!' : '❌ | Something went wrong!',
    })
  },
})
