import { Message } from "discord.js"
import { Command } from "./Command.js"
import { owners } from "./config.js"

class CommandHandler {

    prefix: string
    commands: Command[]
    cooldowns: Map<Command, number> = new Map<Command, number>()
    cooldown_decreaser: NodeJS.Timeout

    constructor(prefix: string, commands: Command[]) {
        this.prefix = prefix
        this.commands = commands
        this.cooldown_decreaser = setInterval(() => this.decrementCooldowns(), 1000)
    }

    decrementCooldowns() {
        for(const [key, value] of this.cooldowns.entries()) {
            this.cooldowns.set(key, value-1)
            if(value-1 <= 0) this.cooldowns.delete(key)
        }
    }

    async handleMessage(self: CommandHandler, msg: Message) {
        if (!msg.content.toLowerCase().startsWith(this.prefix)) return
        let prefix_stripped = msg.content.substring(self.prefix.length)
        let message_parts = prefix_stripped.split(" ")
        let trigger_word = message_parts[0].toLowerCase()
        let args = message_parts.splice(1)

        for (let index in self.commands) {
            let command = self.commands[index]

            if(command.channelType_whitelist !== null && !command.channelType_whitelist.includes(msg.channel.type)) continue
            if(command.channelType_blacklist !== null &&  command.channelType_blacklist.includes(msg.channel.type)) continue
            if(!command.trigger_words.includes(trigger_word)) continue
            if(command.owner_only && !owners.includes(msg.author.id)) continue
            if(!command.bot_can_trigger && msg.author.bot) continue

            try {
                if(this.cooldowns.get(command) !== undefined) {
                    await msg.reply(`Command on cooldown! ${this.cooldowns.get(command)} seconds left.`)
                    continue
                }

                await command.execute(msg, trigger_word, args)
                
                if(command.cooldown !== 0) {
                    this.cooldowns.set(command, command.cooldown)
                }
            } catch(e) {
                console.log(`ERROR! ${(e as Error).message}:\n${(e as Error).stack}`)
            }
            
        }
    }
}

export { CommandHandler }