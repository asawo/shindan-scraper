const rp = require('request-promise');
const cheerio = require('cheerio');
const { App } = require('@slack/bolt');
require('dotenv').config();

const baseURL = 'https://shindanmaker.com/c/list?mode=hot';

const getShindanData = async () => {
	const html = await rp(baseURL);

	const shindanMap = cheerio(
		'#list_result > tbody > tr > td.list_shindantitle > a',
		html
	)
		.map((index, element) => {
			if (index < 10) {
				const title = element.children[0].data;
				const link = `https://shindanmaker.com` + element.attribs.href;
				return { title, link };
			}
		})
		.get();

	return shindanMap;
};

const bot = new App({
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	token: process.env.SLACK_BOT_TOKEN,
});

bot.command('/shindan', async ({ ack, say }) => {
	try {
		await ack();
		await say(`*Loading top 10 shindans* :dash: :dash: :dash:`);

		// need to improve this
		const shindanMap = await getShindanData();
		for (let i = 0; i < shindanMap.length; i++) {
			await say(`${i + 1}. ${shindanMap[i].title} - \`${shindanMap[i].link}\``);
		}
		shindanMap.forEach(async (item) => {});
	} catch (e) {
		console.log(`error responding ${e}`);
	}
});

bot.message('gil shindan', async ({ message, say }) => {
	let randomNum = Math.floor(Math.random() * 10);
	// console.log(randomNum);
	try {
		const shindanMap = await getShindanData();
		await say(
			`<@${message.user}> your gil shindan is: ${shindanMap[randomNum].title} \`${shindanMap[randomNum].link}\``
		);
	} catch (e) {
		console.log(`error responding ${e}`);
	}
});

(async () => {
	await bot.start(process.env.PORT || 3000);

	console.log('⚡️ Bolt app is running on localhost 3000!');
})();
