# Kaihang's Random Bot

This is a custom made bot for my personal slack channel.

## Features

- Logs whenever someone joins a channel in the CHANNEL_ID list into the channel specified by LOG_CHANNEL_ID
- Logs whenever someone leaves a channel in the CHANNEL_ID list from the channel specified by LOG_CHANNEL_ID
- Automatically kicks users in the BANNED_CHANNEL_ID list from the channel specified by CHANNEL_ID

### Here's how to run it!

1. Clone the repo
```bash
git clone https://github.com/kaihangs/kaihangs-random-bot.git
```
2. Install dependencies:
```bash
bun install
```
3. Run the bot:
```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## AI DISCLOSURE
 - index.ts was written with the help of AI suggestions from Zed and ChatGPT
 - Readme has some suggestions from Zed inline
