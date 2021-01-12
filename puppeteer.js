const puppeteer = require('puppeteer');

// const name = "アーサー";
// const url = "https://shindanmaker.com/1043730"

const getShindanResult = async (name, url) => {
   console.time()
   try {
      const browser = await puppeteer.launch({
         args: [
           '--no-sandbox',
           '--disable-setuid-sandbox'
         ]
       });;
      const page = await browser.newPage();
      await page.goto(url);
      await page.type('.input-lg', name);
      await page.keyboard.press('Enter');
      await page.waitForNavigation({
         waitUntil: 'domcontentloaded',
       });
      const result = await page.evaluate(() => document.querySelector('textarea').innerHTML)
      browser.close();
      console.log("result:\n", result)
      console.timeEnd()
      const text = `\`${url}\``
      return result.replace(url, text)

   } catch(e) {
      console.error(e)
   }
}

// gilShindanResult(name, url)

module.exports = { getShindanResult }