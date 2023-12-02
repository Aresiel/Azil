import { EmbedBuilder, Message } from "discord.js";
import { Command } from "../Command.js";
import Weather from "@tinoschroeter/weather-js";

class WeatherCommand extends Command {
    override trigger_words = ["weather"];
    override cooldown: number  = 4;
    override bot_can_trigger: boolean = false;

    weather = new Weather()
    
    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {

        if(args.length === 0) return await msg.reply("Invalid usage.")

        let location_text = args.join(" ")

        let weather_data = await this.weather.find({
             search: location_text, 
             degreeType: "C", 
             lang: "en-UK" 
            })
        
        let result = weather_data[0]
        
        if(result.error !== undefined) return await msg.reply("Unable to find location.")

        const embed = new EmbedBuilder()
            .setTitle(`Weather in ${result.location.name}`)
            .setThumbnail(result.current.imageUrl)
            .addFields(
                {name: result.current.skytext, value: `${result.current.temperature}°C\nFeels like ${result.current.feelslike}°C`, inline: true},
                {name: "Other", value: `Wind: ${result.current.winddisplay}\nHumidity: ${result.current.humidity}%`, inline: true},
                {name: "Metadata", value: `Date: ${result.current.day}, ${result.current.date}\nTime: ${result.current.observationtime}\nLocation: ${result.current.observationpoint}`}
            )
            .setFooter({ text: "From weather.service.msn.com" })
            .setColor(0xdddee1)

        
        await msg.reply({ embeds: [embed] })
    }
}

export {WeatherCommand}