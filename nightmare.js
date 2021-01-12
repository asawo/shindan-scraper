const Nightmare = require('nightmare');

const getShindanResult = async (name, url) => {
   const nightmare = Nightmare({
      show: false,
      loadTimeout: 5000,
   });

   const result = await nightmare
   .goto(url)
   .wait('body')
   .insert('.input-lg', name)
   .click('#shindan_submit')
   .wait('textarea')
   .evaluate(() => document.querySelector('textarea').innerHTML)
   .end()
   .then(shindanResult => {
      const text = `\`${url}\``
      return shindanResult.replace(url, text)
   })
   .catch(e => console.error("getShindanResult error:", e));

   return result
}

module.exports = { getShindanResult }