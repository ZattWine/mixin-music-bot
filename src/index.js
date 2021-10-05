console.clear()

const { Player } = require('discord-player')

const config = require('./data/config.json')
const Client = require('./Client')

const client = new Client()

const player = new Player(client)

player.on('error', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  )
})

player.on('connectionError', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  )
})

player.on('trackStart', (queue, track) => {
  queue.metadata.send(
    `▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`
  )
})

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Track **${track.title}** queued!`)
})

player.on('botDisconnect', (queue) => {
  queue.metadata.send(
    '❌ | I was manually disconnected from the voice channel, clearing queue!'
  )
})

player.on('channelEmpty', (queue) => {
  queue.metadata.send('❌ | Nobody is in the voice channel, leaving...')
})

player.on('queueEnd', (queue) => {
  queue.metadata.send('✅ | Queue finished!')
})

client.on('ready', () => {
  console.log('🚀 Mixin music bot is now online!')
})

client.on('ready', function () {
  client.user.setActivity(config.activity, { type: config.activityType })
})

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(client.prefix)) return
  if (message.author.bot || !message.guild) return
  if (!client.application?.owner) await client.application?.fetch()

  const args = message.content
    .substring(client.prefix.length)
    .trim()
    .split(/ +/)

  const command = client.commands.find((cmd) => cmd.name == args[0])
  if (!command) {
    message.reply(`\"${args[0]}\" is not a valid command!`)
  } else {
    const permisson = message.member.permissions.has(command.permission, true)
    if (!permisson)
      message.reply(
        `You do not have the permission \`${command.permission}\` to run this command!`
      )

    command.run(message, args, client, player)
  }
})

client.start()
