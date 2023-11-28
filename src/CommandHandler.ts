import { Message } from "discord.js"
import { Command } from "./Command.js"
import { owners } from "./config.js"

class CommandHandler {

    prefix: string
    commands: Command[]

    constructor(prefix: string, commands: Command[]) {
        this.prefix = prefix
        this.commands = commands
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
                await command.execute(msg, trigger_word, args)
            } catch(e) {
                console.log(`ERROR! ${(e as Error).message}:\n${(e as Error).stack}`)
            }
            
        }
    }
}

export { CommandHandler }