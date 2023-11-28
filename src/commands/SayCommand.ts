import { Message } from "discord.js";
import { Command } from "../Command.js";

class SayCommand extends Command {
    override trigger_words = ["say"];
    override owner_only = true
    override bot_can_trigger = false

    override async execute(msg: Message<boolean>, trigger_word: string, args: [string]) {
        let text = args.join(" ")
        msg.channel.sendTyping()
        let typing_interval = setInterval(() => { msg.channel.sendTyping() }, 1500)
        setTimeout(async () => {
            await msg.channel.send(text)
            clearInterval(typing_interval)
        }, text.length*50)
    }
}

export {SayCommand}