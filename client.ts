import {Client} from "libfb";

export const client = new Client();
export let botId = ""

client.login(process.env.FACEBOOK_USERNAME, process.env.FACEBOOK_PASSWORD).then(() => {
    console.log(`Logged in!`);
    botId = client.getSession().tokens.uid
})