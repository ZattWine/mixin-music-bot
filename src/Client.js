const fs = require('fs')
const Discord = require('discord.js')
require('dotenv').config()

const config = require('./data/config.json')
const Command = require('./Command')
const Event = require('./Event')
const { Player } = require('discord-player')

const intents = new Discord.Intents(32767) // all intents

class Client extends Discord.Client {
  constructor() {
    super({
      intents,
    })

    /**
     * @type {Discord.Collection<string, Command>}
     */
    this.commands = new Discord.Collection()

    this.prefix = config.prefix
  }

  start() {
    fs.readdirSync('./src/commands')
      .filter((file) => file.endsWith('.js'))
      .forEach((file) => {
        /**
         * @type {Command}
         */
        const command = require(`./commands/${file}`)
        console.log(`Command ${command.name} loaded.`)

        this.commands.set(command.name, command)
      })

    // fs.readdirSync('./src/events')
    //   .filter((file) => file.endsWith('.js'))
    //   .forEach((file) => {
    //     /**
    //      * @type {Event}
    //      */
    //     const event = require(`./events/${file}`)
    //     console.log(`Event ${event.event} loaded.`)
    //     this.on(event.event, event.run.bind(null, this))
    //   })

    this.login(process.env.DISCORD_TOKEN)
  }
}

module.exports = Client
