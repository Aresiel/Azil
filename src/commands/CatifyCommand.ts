import { Message, MessageResolvable, MessageType } from "discord.js";
import { Command } from "../Command.js";

class CatifyCommand extends Command {
    override trigger_words = ["catify"];
    
    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {

        let text

        if (args.length > 0) {
            text = args.join(" ")
        } else {
            if(msg.type === MessageType.Reply && msg.reference !== null) {
                let replied_msg = await msg.channel.messages.fetch(msg.reference.messageId as MessageResolvable)
                text = replied_msg.content
            } else {
                return await msg.reply("Invalid usage.")
            }
        }

        text = text.replace(/[^\.,!?:; -]+/g, "meow")

        let in_sentence = false

        for(let i = 0; i < text.length; i++){
            let char = text.charAt(i)
            if(char == "m" && !in_sentence) {
                text = text.substring(0, i) + "M" + text.substring(i + 1)
                in_sentence = true
            } else if (!(/[^\.!?:;]/.test(char))) {
                in_sentence = false
            }
        }

        if(!text.endsWith(".")) text += "."

        return await msg.reply(`Input > Cat\n> ${text}`)

    }
}

export {CatifyCommand}