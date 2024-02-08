import { Message, MessageResolvable, MessageType } from "discord.js";
import { Command } from "../Command.js";
import translate from "node-google-translate-skidz";

class GoogleTranslateCommand extends Command {
    override trigger_words = ["tl", "translate"];
    override bot_can_trigger = false
    override name = "Translate"
    override global_cooldown = 4

    override async execute(msg: Message<boolean>, trigger_word: string, args: string[]) {

        let options_string: string
        let text: string
        let lang_from: string
        let lang_to: string

        options_string = args[0] !== undefined ? args[0].toLowerCase() : ""

        if (msg.type === MessageType.Reply && msg.reference !== null) {
            if (this.isOptionString(options_string) && args.length === 1 && msg.reference !== null) {
                let replied_msg = await msg.channel.messages.fetch(msg.reference.messageId as MessageResolvable)
                text = replied_msg.content

                lang_from = this.parseOptionString(options_string).from
                lang_to = this.parseOptionString(options_string).to

            } else if (args.length === 0 && msg.reference !== null) {
                let replied_msg = await msg.channel.messages.fetch(msg.reference.messageId as MessageResolvable)
                text = replied_msg.content

                lang_from = this.parseOptionString(">").from
                lang_to = this.parseOptionString(">").to
            } else {
                return await msg.reply("Invalid usage.")
            }


        } else {
            if (this.isOptionString(options_string) && args.length > 1) {
                text = args.slice(1).join(" ")

                lang_from = this.parseOptionString(options_string).from
                lang_to = this.parseOptionString(options_string).to
            } else if (args.length > 0) {
                text = args.join(" ")

                lang_from = this.parseOptionString(">").from
                lang_to = this.parseOptionString(">").to
            } else {
                return await msg.reply("Invalid usage.")
            }
        }


        if (!this.validLangCode(lang_from)) return await msg.reply(`Invalid language, ${lang_from} is not supported.`)
        if (!this.validLangCode(lang_to)) return await msg.reply(`Invalid language, ${lang_to} is not supported.`)

        let translation = await translate(text, lang_from, lang_to)

        if (translation === null || translation === undefined) return await msg.reply("Translation failed.")

        await msg.reply(`${this.langName(translation.src.toLowerCase())} > ${this.langName(lang_to.toLowerCase())}\n> ${translation.translation}`)
    }

    validLangCode(code: string): boolean {
        return Object.keys(languageMap).includes(code)
    }

    langName(code: string) {
        return languageMap[code]
    }

    isOptionString(string: string) {
        return />[A-Za-z-]+/.test(string)
    }

    parseOptionString(string: string) {
        let to_cand = string.split(">")[1]
        let from_cand = string.split(">")[0]

        return {
            to: to_cand !== "" ? to_cand : "en",
            from: from_cand !== "" ? from_cand : "auto"
        }
    }

}

export { GoogleTranslateCommand }

let languageMap = JSON.parse(`{
    "auto": "Auto Detect",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "as": "Assamese",
    "ay": "Aymara",
    "az": "Azerbaijani",
    "bm": "Bambara",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bho": "Bhojpuri",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "zh-cn": "Chinese (Simplified)",
    "zh": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "dv": "Dhivehi",
    "doi": "Dogri",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "ee": "Ewe",
    "fil": "Filipino (Tagalog)",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gn": "Guarani",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "ilo": "Ilocano",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jv or jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "rw": "Kinyarwanda",
    "gom": "Konkani",
    "ko": "Korean",
    "kri": "Krio",
    "ku": "Kurdish",
    "ckb": "Kurdish (Sorani)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "ln": "Lingala",
    "lt": "Lithuanian",
    "lg": "Luganda",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mai": "Maithili",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mni-mtei": "Meiteilon (Manipuri)",
    "lus": "Mizo",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ny": "Nyanja (Chichewa)",
    "or": "Odia (Oriya)",
    "om": "Oromo",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese (Portugal, Brazil)",
    "pa": "Punjabi",
    "qu": "Quechua",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "sa": "Sanskrit",
    "gd": "Scots Gaelic",
    "nso": "Sepedi",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala (Sinhalese)",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tl": "Tagalog (Filipino)",
    "tg": "Tajik",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "th": "Thai",
    "ti": "Tigrinya",
    "ts": "Tsonga",
    "tr": "Turkish",
    "tk": "Turkmen",
    "ak": "Twi (Akan)",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "ug": "Uyghur",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
}`)