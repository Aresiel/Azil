import { Message } from "discord.js"
import { Command } from "./Command.js"
import { owners } from "./config.js"

class CommandHandler {

    prefix: string
    commands: Command[]

    global_cooldowns: Map<Command, number> = new Map<Command, number>()
    individual_cooldowns: Map<string, number> = new Map<string, number>()
    cooldown_decreaser: NodeJS.Timeout

    constructor(prefix: string, commands: Command[]) {
        this.prefix = prefix
        this.commands = commands
        this.cooldown_decreaser = setInterval(() => this.decrementCooldowns(), 1000)
    }

    decrementCooldowns() {
        for(const [key, value] of this.global_cooldowns.entries()) {
            this.global_cooldowns.set(key, value-1)
            if(value-1 <= 0) this.global_cooldowns.delete(key)
        }
        
        for(const [key, value] of this.individual_cooldowns.entries()){
            this.individual_cooldowns.set(key, value-1)
            if(value-1 <= 0) this.individual_cooldowns.delete(key)
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
            this.handleCommand(command, msg, args, trigger_word)
        }
    }

    async handleCommand(command: Command, msg: Message, args: string[], trigger_word: string){
        if(command.channelType_whitelist !== null && !command.channelType_whitelist.includes(msg.channel.type)) return
            if(command.channelType_blacklist !== null &&  command.channelType_blacklist.includes(msg.channel.type)) return
            if(!command.trigger_words.includes(trigger_word)) return
            if(command.owner_only && !owners.includes(msg.author.id)) return
            if(!command.bot_can_trigger && msg.author.bot) return

            if(this.global_cooldowns.get(command) !== undefined) {
                await msg.reply(`Command on global cooldown! ${this.global_cooldowns.get(command)} seconds left.`)
                return
            }

            if(this.individual_cooldowns.get(`${command.name}:${msg.author.id}`) !== undefined) {
                await msg.reply(`Command on cooldown! ${this.individual_cooldowns.get(`${command.name}:${msg.author.id}`)} seconds left.`)
                return
            }

            try {
                await command.execute(msg, trigger_word, args)
            } catch(e) {
                console.log(`ERROR! ${(e as Error).message}:\n${(e as Error).stack}`)
            }

            if(command.global_cooldown !== 0) {
                this.global_cooldowns.set(command, command.global_cooldown)
            }
            if(command.individual_cooldown !== 0) {
                this.individual_cooldowns.set(`${command.name}:${msg.author.id}`, command.individual_cooldown)
            }
    }
}

export { CommandHandler }