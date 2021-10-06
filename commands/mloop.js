const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mloop')
    .setDescription('Sets loop mode')
    .addIntegerOption((option) =>
      option
        .setName('mode')
        .setDescription('Song loop mode options')
        .addChoices([
          ['Off', QueueRepeatMode.OFF],
          ['Track', QueueRepeatMode.TRACK],
          ['Queue', QueueRepeatMode.QUEUE],
          ['Autoplay', QueueRepeatMode.AUTOPLAY],
        ])
        .setRequired(true)
    ),
  async execute(interaction, client, player) {
    try {
      if (
        !(interaction.member instanceof GuildMember) ||
        !interaction.member.voice.channel
      ) {
        return void interaction.reply({
          content: 'You are not in a voice channel!',
          ephemeral: true,
        });
      }

      if (
        interaction.guild.me.voice.channelId &&
        interaction.member.voice.channelId !==
          interaction.guild.me.voice.channelId
      ) {
        return void interaction.reply({
          content: 'You are not in my voice channel!',
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      const queue = player.getQueue(interaction.guildId);
      if (!queue || !queue.playing) {
        return void interaction.followUp({
          content: '🔶 | No music is being played!',
        });
      }

      const loopMode = interaction.options.get('mode').value;
      const success = queue.setRepeatMode(loopMode);
      const mode =
        loopMode === QueueRepeatMode.TRACK
          ? '🔂'
          : loopMode === QueueRepeatMode.QUEUE
          ? '🔁'
          : '▶';

      return void interaction.followUp({
        content: success
          ? `${mode} | Updated loop mode!`
          : '🔶 | Could not update loop mode!',
      });
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content:
          'There was an error trying to execute that command: ' + error.message,
      });
    }
  },
};
