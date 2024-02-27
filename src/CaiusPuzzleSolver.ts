import { Message } from "discord.js";
import { python } from "./config.js"
import { exec } from "child_process";



async function solvePuzzle(msg: Message){
    if(!isPuzzleMessage(msg)) return;

    let numbers = getPuzzleNumbers(msg);
    let target_number = getTargetNumber(msg);

    let solution = await solve(numbers, target_number);

    msg.channel.sendTyping()
    setTimeout(() => {
        msg.reply(`${solution}`);
    }, 3000)
}

function isPuzzleMessage(msg: Message){
    return msg.author.id == "1183911557361582171"
    && msg.content.includes("and may use each number at most once.");
}

function getPuzzleNumbers(msg: Message): number[] {
    let str = ((/(?<=are )(\d+, )+\d+ and \d+(?=.)/).exec(msg.content) ?? [""])[0]

    return str.split("")
        .map(ch => /\d/.test(ch) ? ch : " ")
        .join("")
        .replace(/ +/g, ",")
        .split(",")
        .map(ch => +ch)
}

function getTargetNumber(msg: Message): number {
    let str = (/(?<=Your goal is )\d+(?=.)/.exec(msg.content) ?? [""])[0]

    return +str;
}

async function solve(numbers: number[], target: number): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`${python} ./src/solvePuzzle.py ${target} ${numbers.join(" ")}`, (e, stdout, stderr) => {
            if(stderr.length != 0) reject(stderr);
            resolve(stdout);
        })
    });
}

export { solvePuzzle }