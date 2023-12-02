import { ChannelType, Message } from "discord.js"

abstract class Command {
    abstract trigger_words: string[]
    channelType_whitelist: ChannelType[] | null = null
    channelType_blacklist: ChannelType[] | null = null
    owner_only: boolean = false
    bot_can_trigger: boolean = true
    cooldown: number = 0
    
    abstract execute(msg: Message, trigger_word: string, args: string[]): void
}

export { Command }