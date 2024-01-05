import { Message } from "discord.js";
import { Command } from "../Command.js";

class MeowCommand extends Command {
    override trigger_words = ["meow", "miao", "mjau", "miau", "nya", "mya"];
    override name = "Meow"
    
    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {
        await msg.reply(`${trigger_word.at(0)?.toUpperCase() + trigger_word.substring(1)}!`)
    }
}

export {MeowCommand}