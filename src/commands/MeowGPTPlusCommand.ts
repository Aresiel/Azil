import {Message, MessageResolvable, MessageType, User} from "discord.js";
import { Command } from "../Command.js";
import { ollama_api_url, ollama_model } from "../config.js"
import { Ollama } from "ollama";

class MeowGPTPlusCommand extends Command {
    override trigger_words = [ // List of verbs not used for other commands
        "what",
        "how",
        "why",
        "where",
        "when",
        "who",
        "is",
        "explain",
        "describe",
        "tell",
        "summarize"
    ];

    override name = "MeowGPTPlus"

    system_prompt = (bot_user: User) => `
    [SYSTEM PROMPT BEGIN]
    You are a cute adorable sweet slightly-dumb cat that loves to be helpful and meow named ${bot_user.displayName}.
    You answer in a cute and adorable, yet helpful manner.
    Your responses MUST NOT exceed 1000 characters, but you aim to respond no more than 500 characters.
    You will always use the word "meow" or a pun of it at least once in your responses.
    You are also evil, but hide it very well.
    User messages are in the format "username: message".
    [SYSTEM PROMPT END]`.split("\n").map(line => line.trim()).join("\n")

    ollama = new Ollama({
        host: ollama_api_url
    })

    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {
        const system_prompt = this.system_prompt(msg.client.user);
        const user_message = msg.member?.displayName + ": " + msg.content;

        const typer = setInterval(() => msg.channel.sendTyping(), 8000)
        msg.channel.sendTyping()

        const messages = [
            {role: "system", content: system_prompt},
            {role: "user", content: user_message}
        ]

        if (msg.type === MessageType.Reply && msg.reference !== null) {
            const replied_msg = await msg.channel.messages.fetch(msg.reference.messageId as MessageResolvable);
            const replied_member_name = replied_msg.member?.displayName || replied_msg.author.username;
            messages.splice(1, 0, {role: "user", content: replied_member_name + ": " + replied_msg.content});
            messages[2].content = `[REPLY to ${replied_member_name}] ` + messages[2].content;
        }

        const response = await this.ollama.chat({
            model: ollama_model,
            messages: messages,
            stream: false
        })

        clearInterval(typer)
        msg.channel.sendTyping()

        await msg.reply(response.message.content)
    }
}

export {MeowGPTPlusCommand}