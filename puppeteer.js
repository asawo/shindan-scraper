const puppeteer = require('puppeteer');

let browser;

(async function() {
   browser = await puppeteer.launch({
      args: [
         '--no-sandbox',
         '--disable-setuid-sandbox'
      ]
   });
})();

const getShindanResult = async (name, url) => {
   console.time(`# time for ${name} (${url})\n`)
   try {
      const page = await browser.newPage();
      await page.goto(url);
      const input = await page.$('.input-lg')
      await input.click({clickCount: 3});
      await input.press('Backspace');
      await page.type('.input-lg', name);
      await page.keyboard.press('Enter');
      await page.waitForNavigation({
         waitUntil: 'domcontentloaded',
       });
      const result = await page.evaluate(() => document.querySelector('textarea').innerHTML)
      // console.log("result:\n", result)
      console.timeEnd(`# time for ${name} (${url})\n`)
      const text = `\`${url}\``;
      await page.close();
      return result.replace(url, text)
   } catch(e) {
      console.log(e)
      browser.close();
   }
}

module.exports = { getShindanResult }