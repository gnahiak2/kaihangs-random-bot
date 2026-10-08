# Nibble

This is a custom made bot for my personal slack channel.

## Images
<img width="1209" height="791" alt="image" src="https://github.com/user-attachments/assets/70c668e4-189e-4589-80f1-d898b530953e" />


## Features

- Logs whenever someone joins a channel in the CHANNEL_ID list into the channel specified by LOG_CHANNEL_ID
- Logs whenever someone leaves a channel in the CHANNEL_ID list from the channel specified by LOG_CHANNEL_ID
- Posts a public welcome message when a user joins the channel specified by CHANNEL_ID
- A button to the welcome message that posts 20 :singaporeparrot: emojis when clickedd
- Automatically add new members of the channel to the slack use group specified by USER_GROUP_ID
- Lets users opt outta pings with a button when they first join the channel
- Logs additions and removals from the user group
- Uses rich text formatting (mentions, channel links, user group mentions, and emojis).
- Supports Socket mode

### Here's how to run it!

1. Clone the repo and cd into the directory
```bash
git clone https://github.com/gnahiak2/nibble.git && cd nibble
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
 - Used ChatGPT to compare Ingo's index.ts and my index.ts

 ### What i changed
 - Removed when you say 6 7 or react and send any 6 7 emojis you get kickedx
 - Emoji added to replace :ultrafastcatppuccinparrot: : :singaporeparrot:
 - Edited all of em welcome messages to use the new emojis
 - Logs have no change cuz there is no point
 - Removed Rules link
 - Changed auto added ping group to @kaihang-pings
 - Added dotenv/config
