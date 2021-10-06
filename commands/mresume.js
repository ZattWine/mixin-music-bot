const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mresume')
    .setDescription('Resume current song'),
  async execute(interaction, client, player) {
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
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '🔶 | No music is being played!',
      });
    const success = queue.setPaused(false);
    return void interaction.followUp({
      content: success ? '▶ | Resumed!' : '🔶 | Something went wrong!',
    });
  },
};
