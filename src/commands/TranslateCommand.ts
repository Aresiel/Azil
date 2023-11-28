import { Message } from "discord.js";
import { Command } from "../Command.js";
import { translate } from "bing-translate-api";

class TranslateCommand extends Command {
    override trigger_words = ["tl", "translate"];
    override bot_can_trigger = false

    override async execute(msg: Message<boolean>, trigger_word: string, args: [string]) {
        if (args.length < 1) return await msg.reply("Invalid usage.")

        let options_string: string
        let text: string
        let lang_from: string
        let lang_to: string

        if(/>[A-Za-z-]+/.test(args[0])) { // Language is given
            options_string = args[0].toLowerCase()
            text = args.splice(1).join(" ")

            if (options_string.split(">").length !== 2) return await msg.reply("Invalid usage.")

            lang_from = options_string.split(">")[0].trim()
            lang_to = options_string.split(">")[1].trim()
            if (lang_from === "") lang_from = "auto-detect"
            if(lang_to === "") lang_to = "en"
        } else {
            lang_from = "auto-detect"
            lang_to = "en"
            text = args.join(" ")
        }

        if(!this.validLangCode(lang_from)) return await msg.reply(`Invalid language, ${lang_from} is not supported.`)
        if(!this.validLangCode(lang_to)) return await msg.reply(`Invalid language, ${lang_to} is not supported.`)

        let translation = await translate(text, lang_from, lang_to)

        await msg.reply(`${this.langName(translation.language.from.toLowerCase())} > ${this.langName(translation.language.to.toLowerCase())}\n> ${translation.translation}`)
    }

    validLangCode(code: string): boolean {
        return Object.keys(languageMap).includes(code)
    }
    
    langName(code: string){
        return languageMap[code]
    }

}

export {TranslateCommand}

let languageMap = JSON.parse(`{
    "auto-detect": "Auto Detect",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "as": "Assamese",
    "az": "Azerbaijani",
    "bn": "Bangla",
    "ba": "Bashkir",
    "eu": "Basque",
    "bho": "Bhojpuri",
    "brx": "Bodo",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "yue": "Cantonese (Traditional)",
    "ca": "Catalan",
    "lzh": "Chinese (Literary)",
    "zh-hans": "Chinese Simplified",
    "zh-hant": "Chinese Traditional",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "prs": "Dari",
    "dv": "Divehi",
    "doi": "Dogri",
    "nl": "Dutch",
    "en": "English",
    "et": "Estonian",
    "fo": "Faroese",
    "fj": "Fijian",
    "fil": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fr-ca": "French (Canada)",
    "gl": "Galician",
    "lug": "Ganda",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "he": "Hebrew",
    "hi": "Hindi",
    "mww": "Hmong Daw",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ikt": "Inuinnaqtun",
    "iu": "Inuktitut",
    "iu-latn": "Inuktitut (Latin)",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "kn": "Kannada",
    "ks": "Kashmiri",
    "kk": "Kazakh",
    "km": "Khmer",
    "rw": "Kinyarwanda",
    "tlh-latn": "Klingon (Latin)",
    "gom": "Konkani",
    "ko": "Korean",
    "ku": "Kurdish (Central)",
    "kmr": "Kurdish (Northern)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "lv": "Latvian",
    "ln": "Lingala",
    "lt": "Lithuanian",
    "dsb": "Lower Sorbian",
    "mk": "Macedonian",
    "mai": "Maithili",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mr": "Marathi",
    "mn-cyrl": "Mongolian (Cyrillic)",
    "mn-mong": "Mongolian (Traditional)",
    "my": "Myanmar (Burmese)",
    "mi": "Māori",
    "ne": "Nepali",
    "nb": "Norwegian",
    "nya": "Nyanja",
    "or": "Odia",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese (Brazil)",
    "pt-pt": "Portuguese (Portugal)",
    "pa": "Punjabi",
    "otq": "Querétaro Otomi",
    "ro": "Romanian",
    "run": "Rundi",
    "ru": "Russian",
    "sm": "Samoan",
    "sr-cyrl": "Serbian (Cyrillic)",
    "sr-latn": "Serbian (Latin)",
    "st": "Sesotho",
    "nso": "Sesotho sa Leboa",
    "tn": "Setswana",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "sw": "Swahili",
    "sv": "Swedish",
    "ty": "Tahitian",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "th": "Thai",
    "bo": "Tibetan",
    "ti": "Tigrinya",
    "to": "Tongan",
    "tr": "Turkish",
    "tk": "Turkmen",
    "uk": "Ukrainian",
    "hsb": "Upper Sorbian",
    "ur": "Urdu",
    "ug": "Uyghur",
    "uz": "Uzbek (Latin)",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yo": "Yoruba",
    "yua": "Yucatec Maya",
    "zu": "Zulu"
}`)