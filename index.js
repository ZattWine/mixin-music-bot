require('./deploy');
require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { Player } = require('discord-player');

const config = require('./config.json');
const Client = require('./client/Client');

const client = new Client();
module.exports.client = client;
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

console.log(client.commands);

/** Player */
const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
});

player.on('connectionError', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`▶ | Start playing: **\`${track.title}\`**`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Track **\`${track.title}\`** is added to queue!`);
});

player.on('botDisconnect', (queue) => {
  queue.metadata.send(
    '🔶 | I was manually disconnected from the voice channel, clearing queue!'
  );
});

player.on('channelEmpty', (queue) => {
  queue.metadata.send('🔶 | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', (queue) => {
  queue.metadata.send('🐽 | There is no songs to play in the queue!');
});

client.once('ready', () => {
  console.log(
    `🚀 Mixin music bot is now online!\n🤖 Login as ${client.user.tag}`
  );
});

client.on('ready', function () {
  client.user.setActivity(config.activity, { type: config.activityType });
});

client.once('shardReconnecting', () => {
  console.log('Reconnecting...');
});

client.once('shardDisconnect', () => {
  console.log('Disconnect!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
});

client.on('interactionCreate', async (interaction) => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (
      interaction.commandName == 'ban' ||
      interaction.commandName == 'userinfo'
    ) {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, client, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'There was an error trying to execute that command!',
    });
  }
});

client.login(process.env.TOKEN);
