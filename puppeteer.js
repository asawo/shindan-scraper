const puppeteer = require('puppeteer');

// const name = "アーサー";
// const url = "https://shindanmaker.com/1043730"

let browser;
let page;

(async function() {
   browser = await puppeteer.launch({
      args: [
         '--no-sandbox',
         '--disable-setuid-sandbox'
      ]
   });
   page = await browser.newPage();
})();

const getShindanResult = async (name, url) => {
   console.time(`# time for ${name} (${url})\n`)
   try {
      await page.goto(url);
      const input = await page.$('.input-lg')
      await input.click({clickCount: 2});
      await input.press('Backspace'); 
      await page.type('.input-lg', name);
      await page.keyboard.press('Enter');
      await page.waitForNavigation({
         waitUntil: 'domcontentloaded',
       });
      const result = await page.evaluate(() => document.querySelector('textarea').innerHTML)
      console.log("result:\n", result)
      console.timeEnd(`# time for ${name} (${url})\n`)
      const text = `\`${url}\``
      return result.replace(url, text)
   } catch(e) {
      console.error(e)
      browser.close();
   }
}

// gilShindanResult(name, url)

module.exports = { getShindanResult }