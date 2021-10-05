const { GuildMember } = require('discord.js')
const { QueryType } = require('discord-player')
const Command = require('../Command')

module.exports = new Command({
  name: 'p',
  description: 'Play a song.',
  permission: 'SEND_MESSAGES',
  async run(message, args, client, player) {
    let voiceChannel = message.member.voice.channel

    try {
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

      const query = args.join(' ')
      const searchResult = await player
        .search(query, {
          requestedBy: message.author,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {})

      if (!searchResult || !searchResult.tracks.length)
        return void message.reply({ content: 'No results were found!' })

      let queue = await player.createQueue(message.guildId, {
        metadata: message.channel,
      })

      // verify vc connection
      try {
        if (!queue.connection) await queue.connect(voiceChannel)
      } catch {
        void player.deleteQueue(message.guildId)
        return void message.reply({
          content: 'Could not join your voice channel!',
        })
      }

      await message.reply({
        content: `⏱ | Loading your ${
          searchResult.playlist ? 'playlist' : 'track'
        }...`,
      })

      searchResult.playlist
        ? queue.addTracks(searchResult.tracks)
        : queue.addTrack(searchResult.tracks[0])

      if (!queue.playing) await queue.play()
    } catch (error) {
      console.log(error)
      message.reply({
        content:
          'There was an error trying to execute that command: ' + error.message,
      })
    }
  },
})
