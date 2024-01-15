import { GatewayIntentBits, Client, Events } from "discord.js"
import { token, prefix } from "./config.js"
import { CommandHandler } from "./CommandHandler.js"
import { MeowCommand } from "./commands/MeowCommand.js"
import { MeowGPTCommand } from "./commands/MeowGPTCommand.js"
import { SayCommand } from "./commands/SayCommand.js"
import { BingTranslateCommand } from "./commands/BingTranslateCommand.js"
import { GoogleTranslateCommand } from "./commands/GoogleTranslateCommand.js"
import { CatifyCommand } from "./commands/CatifyCommand.js"
import { WeatherCommand } from "./commands/WeatherCommand.js"
import { FauxHelpCommand } from "./commands/FauxHelpCommand.js"

const client  = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        //GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        //GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ]
})

client.on(Events.ClientReady, readyClient => {
    console.log(`${readyClient.user.username} is awake! 👀`)
})

let command_handler = new CommandHandler(prefix, [
    new MeowCommand,
    new MeowGPTCommand,
    new SayCommand,
    new GoogleTranslateCommand,
    new CatifyCommand,
    new WeatherCommand,
    new FauxHelpCommand
])
client.on(Events.MessageCreate, msg => command_handler.handleMessage(command_handler, msg))
console.log(`Registered command handler with prefix "${prefix}" and command${command_handler.commands.length == 1 ? "" : "s"} ${command_handler.commands.map(cmd => cmd.constructor.name).join(", ")}`)

client.login(token)