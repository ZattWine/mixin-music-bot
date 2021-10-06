const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about user')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user you want to get info about')
        .setRequired(true)
    ),
  execute(interaction, client) {
    const member = interaction.options.get('user').value;
    const user = client.users.cache.get(member);

    interaction.reply({
      content: `Name: ${user.username}, ID: ${
        user.id
      }, Avatar: ${user.displayAvatarURL({ dynamic: true })}`,
      ephemeral: true,
    });
  },
};
