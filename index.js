const { App } = require('@slack/bolt');
const { getShindanList } = require('./shindanList')
const { getShindanResult } = require('./puppeteer')
require('dotenv').config();

const bot = new App({
   signingSecret: process.env.SLACK_SIGNING_SECRET,
   token: process.env.SLACK_BOT_TOKEN,
});

const userObj = {
   UUPETQLAJ: "アーサー",
   UUM9TGSDT: "ジェイク",
   UULQF63EY: "フィル",
   UUM8U1ASU: "マーク",
   UUMB23QTS: "グレイアム",
   UUMDEN613: "アド",
   UU8FL84DQ: "クリス",
   U011W9GEY5P: "ホゼ",
   UUPEWJ7GE: "ジミー",
   UUM4C1FKN: "ルアン"
}

// Return list of top 10 shindans
bot.command('/shindan', async ({ ack, say }) => {
   console.info("/shindan called")
   try {
     await ack();
     await say(`*Loading...* :dash: :dash: :dash:`);
     const shindanMap = await getShindanList();
     await say({
       blocks: [
         { type: 'divider' },
         {
           type: 'header',
           text: {
             type: 'plain_text',
             text: '🔥 Hottest 10 🔥',
             emoji: true,
           },
         },
         {
           type: 'section',
           text: {
             type: 'mrkdwn',
             text:
               `*1.* ${shindanMap[0].title} \n \`${shindanMap[0].link}\`\n` +
               `*2.* ${shindanMap[1].title} \n \`${shindanMap[1].link}\`\n` +
               `*3.* ${shindanMap[2].title} \n \`${shindanMap[2].link}\`\n` +
               `*4.* ${shindanMap[3].title} \n \`${shindanMap[3].link}\`\n` +
               `*5.* ${shindanMap[4].title} \n \`${shindanMap[4].link}\`\n` +
               `*6.* ${shindanMap[5].title} \n \`${shindanMap[5].link}\`\n` +
               `*7.* ${shindanMap[6].title} \n \`${shindanMap[6].link}\`\n` +
               `*8.* ${shindanMap[7].title} \n \`${shindanMap[7].link}\`\n` +
               `*9.* ${shindanMap[8].title} \n \`${shindanMap[8].link}\`\n` +
               `*10.* ${shindanMap[9].title} \n \`${shindanMap[9].link}\`\n`,
           },
         },
       ],
     });
   } catch (e) {
     console.error(`error responding ${e}`);
   }
 });

// Listen for and handle message
bot.message(
   /gil shindan|random shindan|give me shindan/i,
   async ({ message, say }) => {
      console.info("'gil shindan' called")
      let randomNum = Math.floor(Math.random() * 10);
      try {
         const shindanMap = await getShindanList();
         const username = userObj[message.user];
         await say(`<@${message.user}>さんの診断　:raised_hands:\n*「${shindanMap[randomNum].title}」*`)
         const result = await getShindanResult(username, shindanMap[randomNum].link);
         await say(result);
      } catch (e) {
         console.error(`error in message listener ${e}`);
      }
   }
);
   
(async () => {
   await bot.start(8080);
   console.info('⚡️ Bolt app is running on localhost 8080!');
})();
