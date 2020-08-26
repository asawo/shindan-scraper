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
		await say(`*Loading...* :dash: :dash: :dash:`);

		const shindanMap = await getShindanData();

		await say({
			blocks: [
				{
					type: 'divider',
				},
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
							'*1.* ' +
							shindanMap[0].title +
							'\n`' +
							shindanMap[0].link +
							'`\n' +
							'*2.* ' +
							shindanMap[1].title +
							'\n`' +
							shindanMap[1].link +
							'`\n' +
							'*3.* ' +
							shindanMap[2].title +
							'\n`' +
							shindanMap[2].link +
							'`\n' +
							'*4.* ' +
							shindanMap[3].title +
							'\n`' +
							shindanMap[3].link +
							'`\n' +
							'*5.* ' +
							shindanMap[4].title +
							'\n`' +
							shindanMap[4].link +
							'`\n' +
							'*6.* ' +
							shindanMap[5].title +
							'\n`' +
							shindanMap[5].link +
							'`\n' +
							'*7.* ' +
							shindanMap[6].title +
							'\n`' +
							shindanMap[6].link +
							'`\n' +
							'*8.* ' +
							shindanMap[7].title +
							'\n`' +
							shindanMap[7].link +
							'`\n' +
							'*9.* ' +
							shindanMap[8].title +
							'\n`' +
							shindanMap[8].link +
							'`\n' +
							'*10.* ' +
							shindanMap[9].title +
							'\n`' +
							shindanMap[9].link +
							'`\n',
					},
				},
			],
		});
	} catch (e) {
		console.log(`error responding ${e}`);
	}
});

bot.message('gil shindan', async ({ message, say }) => {
	let randomNum = Math.floor(Math.random() * 10);

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
