import { Message } from "discord.js";
import { Command } from "../Command.js";

class FauxHelpCommand extends Command {
    override trigger_words = ["help"];
    override name = "Help"
    override individual_cooldown = 5;
    
    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {
        await msg.reply({
            content: "Hope this helps!",
            files: [{
                attachment: "https://cataas.com/cat/cute",
                name: "cat.jpg",
                description: "A picture of a cute cat!"
            }]
        })
    }
}

export {FauxHelpCommand}