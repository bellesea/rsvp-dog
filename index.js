const { App } = require("@slack/bolt");
require("dotenv").config();

// Initializes your app with credentials

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.command("/fetch", async ({ ack, command, say }) => {
  await ack();
  try {
    say("hi")
    let text = command.text; // https://hackclub.slack.com/archives/C0266FRGT/p1705102753884219
    let remove = "https://hackclub.slack.com/archives/";

    let text2 = text.split(" ");
    let emoji = text2[1]

    let newText = text2[0].replace(remove, "");

    let info = newText.split("/");
    let channel = info[0];
    let tempTime = info[1].slice(1);
    let time = tempTime.slice(0, 10) + "." + tempTime.slice(10);

    console.log(channel, time);

    const result = await app.client.reactions.get({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      full: true,
      timestamp: time,
    });

    // let res = JSON.stringify(result);
    console.log(result.message.reactions)
    const usersTemp = result.message.reactions.find(
      (reaction) => reaction.name === emoji
    );

    const users = usersTemp.users.map((x) => "<@" + x + ">");

    const rsvp = users.toString().replaceAll(",", " ")

    say(rsvp)
    
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log("Bolt app started!!");
})();
