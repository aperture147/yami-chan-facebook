import {Message} from "libfb";
import {client} from "../mongo";
import {client as fbClient} from "../client";

export function ping(msg: Message): void {
    const now: number = Date.now()
    const fbLatency: number = Math.abs(Date.now() - msg.timestamp)
    client.db("yami").admin().ping().then(() => {
        fbClient.sendMessage(msg.threadId,
            `Messenger: \`${fbLatency}\`ms\n` +
            `Database: \`${Math.abs(Date.now() - now)}ms\``)
    }).catch(err => {
        fbClient.sendMessage(msg.threadId,
            `Messenger: \`${fbLatency}\`ms\n` +
            `Database: \`${err}ms\``)
    })

}