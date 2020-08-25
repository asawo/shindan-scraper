# 🕷 Shindan scraper

A simple web scraper using node.js & cheerio.

I'm just getting the hottest daily shindans from https://shindanmaker.com/ and returning the title + link in json format.

## 🤖 Shindan-bot

I made this into a slack bot using the [Bold library](https://github.com/slackapi/bolt-js).

You can use the slack command `/shindan` and the bot will reply with the hottest 10 shindans!

If you want the bot to pick 1 random shindan for you, send a message containing the phrase `gil shindan`.
