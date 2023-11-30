import { Message } from "discord.js";
import { Command } from "../Command.js";

class MeowGPTCommand extends Command {
    override trigger_words = ["what", "how", "why", "where", "when", "who", "is"];
    
    override async execute(msg: Message<boolean>, trigger_word: string, args: [string]) {
        if(!msg.content.includes("?")) return
        await msg.reply(this.meowGPTReponse())
    }

    meowGPTReponse(): string {
        const max_length =  20
        const min_length = 5
        const die_sides = 20

        let length = min_length + Math.floor(Math.random()*(max_length-min_length+1))

        let dice_weight = 0 + (max_length-length)/2

        let output = ""

        for(let i = 0; i < length; i++){
            let die = Math.floor(Math.random()*(Math.max(die_sides-dice_weight, 4)))
            if (die == 0) { output += "meow, "; dice_weight = 0}
            else if (die == 1) { output += "meow! "; dice_weight = 0 }
            else if (die == 2) { output += "meow. "; dice_weight = 0 }
            else if (die == 3) { output += "meow? "; dice_weight = 0 }
            else { output += "meow "; dice_weight += 2 }
        }

        output = output.replaceAll(". meow", ". Meow")
        output = output.replaceAll("! meow", "! Meow")
        output = output.replaceAll("? meow", "? Meow")
        output = output.trim()
        output = "M" + output.substring(1)
        if (output.charAt(output.length-1) == "w") output = output + "."

        return output
    }
}

export {MeowGPTCommand}