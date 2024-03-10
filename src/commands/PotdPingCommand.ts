import { Message } from "discord.js";
import { Command } from "../Command.js";

class PotdPingCommand extends Command { // Temp command, do not use outside STEM
    override trigger_words = ["potdping"];
    override bot_can_trigger = false
    override name = "Potd Ping"

    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {
        if(msg.channel.id !== "1210239078184779928") { // Id of #potd in STEM
            return
        }
        try {
            await msg.channel.send("<@&1210378506903748690>")
            await msg.delete()
        } catch (e) {
            
        }
    }
}

export {PotdPingCommand}