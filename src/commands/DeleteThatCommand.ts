import {Message, MessageResolvable, MessageType} from "discord.js";
import { Command } from "../Command.js";
import {owners} from "../config.js";

class DeleteThatCommand extends Command {
    override trigger_words = ["delete"];
    override bot_can_trigger = false
    override name = "Delete That"

    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {
        if(msg.type !== MessageType.Reply || msg.reference === null) {
            return await msg.reply("You must reply to a message to delete it.");
        }

        const messageToDelete = await msg.channel.messages.fetch(msg.reference.messageId as MessageResolvable);

        if(owners.includes(msg.author.id)) {
            if(messageToDelete.deletable) {
                await messageToDelete.delete();
                return await msg.reply("okie dokie");
            } else {
                return await msg.reply("sorry I can't")
            }
        }

        if(messageToDelete.author.id !== msg.client.user.id) {
            return await msg.reply("nuh uh")
        } else {
            if(messageToDelete.type === MessageType.Reply && messageToDelete.reference !== null) {
                const repliedMsg = await msg.channel.messages.fetch(messageToDelete.reference.messageId as MessageResolvable);
                if(repliedMsg.author.id === msg.author.id) {
                    if(messageToDelete.deletable) {
                        await messageToDelete.delete();
                        return await msg.reply("okie dokie");
                    } else {
                        return await msg.reply("sorry I can't")
                    }
                } else {
                    return await msg.reply("nuh uh")
                }
            }
        }
    }
}

export {DeleteThatCommand}