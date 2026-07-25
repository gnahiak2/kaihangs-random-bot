# Kaihang's Random Bot

This is a custom made bot for my personal slack channel.

# Images
<img width="1637" height="1024" alt="image" src="https://github.com/user-attachments/assets/a4b296c3-12f6-40e3-a771-ff911f15e8b6" />


## Features

- Logs whenever someone joins a channel in the CHANNEL_ID list into the channel specified by LOG_CHANNEL_ID
- Logs whenever someone leaves a channel in the CHANNEL_ID list from the channel specified by LOG_CHANNEL_ID
- Posts a public welcome message when a user joins the channel specified by CHANNEL_ID
- A button to the welcome message that posts 20 :singaporeparrot: emojis when clicked
- Another button to the welcome message that posts 20 :hehheh: emojis when clicked
- ANOTHER button to the welcome message that posts 20 :rahh: emojis when clicked
- Automatically add new members of the channel to the slack use group specified by USER_GROUP_ID
- Lets users opt outta pings with a button
- Logs additions and removals from the user group
- Uses rich text formatting (mentions, channel links, user group mentions, and emojis).
- Supports both Socket mode and HTTP mode.

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
