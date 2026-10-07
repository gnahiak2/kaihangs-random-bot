// index.ts
import {
  App,
  type BlockAction,
} from "@slack/bolt";
import "dotenv/config";

import {
  BANNED_USER_IDS,
  CHANNEL_ID,
  GROUP_ID,
} from "./constants";

const bannedUserIds = new Set<string>(BANNED_USER_IDS);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: process.env.SLACK_SOCKET_MODE === "true",
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event("member_joined_channel", async ({ event, logger }) => {
  if (event.channel !== CHANNEL_ID) return;

  try {
    if (bannedUserIds.has(event.user)) {
      await app.client.conversations.kick({
        channel: event.channel,
        user: event.user,
      });

      return;
    }

    await app.client.chat.postMessage({
      channel: event.channel,
      text: `Welcome <@${event.user}> to #kaihang-does-something! OI @gnahiak2 GET HERE NOW :singaporeparrot:`,
      blocks: [
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_section",
              elements: [
                {
                  type: "text",
                  text: "everyone welcome ",
                },
                {
                  type: "user",
                  user_id: event.user,
                },
                {
                  type: "text",
                  text: " to ",
                },
                {
                  type: "channel",
                  channel_id: CHANNEL_ID,
                },
                {
                  type: "text",
                  text: "! OI",
                },
                {
                  type: "user",
                  user_id: USER_ID,
                },
                {
                  type: "text",
                  text: "GET OVER ERE!",
                },
                {
                  type: "emoji",
                  name: "singaporeparrot",
                },
              ],
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: ":singaporeparrot:",
                emoji: true,
              },
              value: "singaporeparrot",
              action_id: "singaporeparrot",
            },
          ],
        },
      ],
    });

    const existingMembers = await app.client.usergroups.users.list({
      usergroup: GROUP_ID,
    });

    const members = existingMembers.users || [];

    if (!members.includes(event.user)) {
      await app.client.usergroups.users.update({
        usergroup: GROUP_ID,
        users: [...members, event.user].join(","),
      });
    }

    await app.client.chat.postEphemeral({
      channel: event.channel,
      user: event.user,
      text: `hello! welcome to #kaihangs-shitdump! :singaporeparrot:
this is where i yap about random stuff, my life and do something.
btw i added you to @kaihang-ping ping group so you can get pung when i post anything.`,
      blocks: [
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_section",
              elements: [
                {
                  type: "text",
                  text: "hello! welcome to ",
                },
                {
                  type: "channel",
                  channel_id: CHANNEL_ID,
                },
                {
                  type: "text",
                  text: "! ",
                },
                {
                  type: "emoji",
                  name: "rahh",
                },
                {
                  type: "text",
                  text: "\nthis is where i yap about random stuff, and do something.\n\nbtw i added you to ",
                },
                {
                  type: "usergroup",
                  usergroup_id: GROUP_ID,
                },
                {
                  type: "text",
                  text: " so you can get pung when i post interesting stuff.",
                },
              ],
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "opt out of pings",
                emoji: true,
              },
              value: "remove_from_ping_group",
              action_id: "remove_from_ping_group",
            },
          ],
        },
      ],
    });
  } catch (error) {
    logger.error(
      `Failed to handle member_joined_channel for ${event.user}:`,
      error,
    );
  }
});

app.event("member_left_channel", async ({ event, logger }) => {
  if (event.channel !== CHANNEL_ID) return;

  try {
    await app.client.chat.postMessage({
      channel: event.channel,
      text: `everyone say bye to <@${event.user}> :sob: :noooovanish: :wahhhh: `,
      blocks: [
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_section",
              elements: [
                {
                  type: "text",
                  text: "everyone say bye to ",
                },
                {
                  type: "user",
                  user_id: event.user,
                },
                {
                  type: "text",
                  text: " ",
                },
                {
                  type: "emoji",
                  name: "sob",
                },
                {
                  type: "emoji",
                  name: "noooovanish",
                },
                {
                  type: "emoji",
                  name: "wahhhh",
                },
              ],
            },
          ],
        },
      ],
    });

    const existingMembers = await app.client.usergroups.users.list({
      usergroup: GROUP_ID,
    });

    const members = existingMembers.users || [];

    if (members.includes(event.user)) {
      await app.client.usergroups.users.update({
        usergroup: GROUP_ID,
        users: members.filter((id) => id !== event.user).join(","),
      });
    }
  } catch (error) {
    logger.error(
      `Failed to handle member_left_channel for ${event.user}:`,
      error,
    );
  }
});

app.action(
  "remove_from_ping_group",
  async ({ body, ack, respond, logger }) => {
    await ack();

    try {
      const existingMembers = await app.client.usergroups.users.list({
        usergroup: GROUP_ID,
      });

      const members = existingMembers.users || [];

      await app.client.usergroups.users.update({
        usergroup: GROUP_ID,
        users: members
          .filter((id) => id !== body.user.id)
          .join(","),
      });

      await respond({
        text: "Ok, you've been removed from the ping group.",
      });
    } catch (error) {
      logger.error("Failed to remove user from ping group:", error);

      await respond({
        text: "Something went wrong while removing you from the ping group.",
      });
    }
  },
);

app.action(
  "singaporeparrot",
  async ({ body, context, ack, respond, logger }) => {
    await ack();

    try {
      const message = (body as BlockAction).message;

      await respond({
        replace_original: false,
        delete_original: false,
        response_type: "in_channel",
        thread_ts: message?.ts,
        text:
          ":singaporeparrot:".repeat(20) +
          `\nSent by <@${context.userId}>`,
        blocks: [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: Array(20).fill({
                  type: "emoji",
                  name: "singaporeparrot",
                }),
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: "Sent by ",
                  },
                  {
                    type: "user",
                    user_id: context.userId,
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      logger.error("Failed to handle singaporeparrot action:", error);
    }
  },
);

app.action(
  "rahh",
  async ({ body, context, ack, respond, logger }) => {
    await ack();

    try {
      const message = (body as BlockAction).message;

      await respond({
        replace_original: false,
        delete_original: false,
        response_type: "in_channel",
        thread_ts: message?.ts,
        text:
          ":rahh:".repeat(20) +
          `\nSent by <@${context.userId}>`,
        blocks: [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: Array(20).fill({
                  type: "emoji",
                  name: "rahh",
                }),
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: "Sent by ",
                  },
                  {
                    type: "user",
                    user_id: context.userId,
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      logger.error("Failed to handle rahh action:", error);
    }
  },
);

app.action(
  "hehheh",
  async ({ body, context, ack, respond, logger }) => {
    await ack();

    try {
      const message = (body as BlockAction).message;

      await respond({
        replace_original: false,
        delete_original: false,
        response_type: "in_channel",
        thread_ts: message?.ts,
        text:
          ":hehheh:".repeat(20) +
          `\nSent by <@${context.userId}>`,
        blocks: [
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: Array(20).fill({
                  type: "emoji",
                  name: "hehheh",
                }),
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: "Sent by ",
                  },
                  {
                    type: "user",
                    user_id: context.userId,
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      logger.error("Failed to handle hehheh action:", error);
    }
  },
);

const GREETINGS = ["mrrp", "meow"];

const MIN_COOLDOWN_MS = 1000;
const MAX_COOLDOWN_MS = 10 * 60 * 1000;

async function startRandomGreetings() {
  while (true) {
    const delay =
      MIN_COOLDOWN_MS +
      Math.random() * (MAX_COOLDOWN_MS - MIN_COOLDOWN_MS);

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const text =
        GREETINGS[Math.floor(Math.random() * GREETINGS.length)] ?? "meow";

      await app.client.chat.postMessage({ channel: CHANNEL_ID, text });
    } catch (error) {
      app.logger.error("Failed to send random greeting:", error);
    }
  }
}

(async () => {
  await app.start();

  app.logger.info("⚡️ Bolt app is running!");

  startRandomGreetings();
})();
