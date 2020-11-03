import {Message} from "libfb";
import {client} from "../mongo";
import {client as fbClient} from "../client";

const ObjectID = require('mongodb').ObjectID
const re = /[\s]+/


export function send(msg: Message): void {
    const collection = client.db("yami").collection("text_" + msg.threadId)
    const content = msg.message.split(re, 2)
    let promise
    // If the input is a mongo objectId
    if (ObjectID.isValid(content[1]))
        promise = collection.findOne({"_id": ObjectID.createFromHexString(content[1])})
    else
        promise = collection.findOne({"name": content[1]})
    promise.then(result =>
        fbClient
            .sendMessage(msg.threadId, result ? `${result.content}\n ID: \`${result._id}\`` : "No text found")
            .catch(console.error))
        .catch(err => console.log(err))
}

export function add(msg: Message): void {
    const collection = client.db("yami").collection("text_" + msg.threadId)
    const content = msg.message.split(re, 3)
    if (!content[1]) {
        fbClient
            .sendMessage(msg.threadId, "No text name provided")
            .catch(console.error)
        return
    }
    if (!content[2]) {
        fbClient
            .sendMessage(msg.threadId, "No fact content provided")
            .catch(console.error)
        return
    }
    collection.updateOne(
        {"name": content[1]},
        {
            $set: {
                "content": msg.message.replace("!at", "").replace(content[1], "").trim(),
                "author": msg.authorId
            }
        },
        {upsert: true})
        .then(result => {
            if (result.upsertedId)
                fbClient
                    .sendMessage(msg.threadId, `New text added with id \`${result.upsertedId._id}\``)
                    .catch(console.error)
            else fbClient
                .sendMessage(msg.threadId, `\`${content[1]}\` text has been updated`)
                .catch(console.error)
        })
        .catch(err => {
            fbClient
                .sendMessage(msg.threadId, `Cannot add new text`)
                .catch(console.error)
            console.error(err)
        });
}

export function random(msg: Message): void {
    const collection = client.db("yami").collection("text_" + msg.threadId)
    collection.aggregate([{"$sample": {"size": 1}}], (err, cursor) => {
        cursor.next().then(result => {
            fbClient.sendMessage(msg.threadId, result.content).catch(console.error)
            cursor.close().catch(console.error)
        }).catch(console.error)
    })
}