import {client, botId} from "./client";
import {handle} from "./command";

client.on('message', message => {
    // Prevent self doom
    if (message.authorId !== botId)
        try {
            handle(message)
        } catch (e) {
            client.sendMessage(message.threadId, "An server error occurred, please contact bot dev!")
        }
})