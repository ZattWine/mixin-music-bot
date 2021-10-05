const { GuildMember } = require('discord.js')

const Command = require('../Command')

module.exports = new Command({
  name: 'nowplaying',
  description: 'Get the song that is currently playing.',
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

    const progress = queue.createProgressBar()
    const perc = queue.getPlayerTimestamp()

    return void message.reply({
      embeds: [
        {
          title: 'Now Playing',
          description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
          fields: [
            {
              name: '\u200b',
              value: progress,
            },
          ],
          color: 0xffffff,
        },
      ],
    })
  },
})
