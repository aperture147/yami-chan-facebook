import {Message} from "libfb";
import {client} from "./client";
import "./mongo"
import * as text from "./command/text"
import {ping} from "./command/ping"

const re = /[\s]+/

export function handle(msg: Message): void {
    const cmd = msg.message.split(re, 1)[0].toLowerCase()
    switch (cmd) {
        case "!p":
        case "!ping":
            ping(msg)
            break

        case "!t":
        case "!text":
            text.send(msg)
            break

        case "!at":
        case "!addtext":
            text.add(msg)
            break

        case "!rt":
        case "!randomtext":
            text.random(msg)
            break

        case "!code":
            client.sendMessage(msg.threadId, "https://github.com/aperture147/yami-chan-facebook")
            break
    }
}