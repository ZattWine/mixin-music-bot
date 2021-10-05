const { Player } = require('discord-player')
const Discord = require('discord.js')

const Client = require('./Client')

/**
 *
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {Client} client
 * @param {Player} player
 */
function RunFunction(message, args, client, player) {}

class Command {
  /**
   * @typedef {{name: string, description: string, permission: keyof Discord.PermissionString | string, run: RunFunction}} CommandOptions
   * @param {CommandOptions} options
   */
  constructor(options) {
    this.name = options.name
    this.description = options.description
    this.permission = options.permission
    this.run = options.run
  }
}

module.exports = Command
