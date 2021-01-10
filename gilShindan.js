const Nightmare = require('nightmare');

const getShindanResult = async (name, url) => {
   const nightmare = Nightmare({show: false});

   return await nightmare
   .goto(url)
   .wait('body')
   .insert('.input-lg', name)
   .click('#shindan_submit')
   .wait('textarea')
   .evaluate(() => document.querySelector('textarea').innerHTML)
   .end(result => {
      const text = `\`${url}\``
      return result.replace(url, text)
   })
   .catch(e => console.error("getShindanResult error:", e));
}

module.exports = { getShindanResult }