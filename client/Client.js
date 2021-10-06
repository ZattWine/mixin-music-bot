const { Client, Collection, Intents } = require('discord.js');

module.exports = class extends Client {
  constructor(config) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });

    this.config = config;
    this.commands = new Collection();
  }
};
