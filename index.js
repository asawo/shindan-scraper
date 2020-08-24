const rp = require('request-promise');
const cheerio = require('cheerio');

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

getShindanData().then((data) => {
	console.log(data);
});
