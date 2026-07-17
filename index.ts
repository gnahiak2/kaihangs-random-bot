// index.ts
import {
  App,
  type BlockAction,
} from "@slack/bolt";

import {
  BANNED_USER_IDS,
  CHANNEL_ID,
  GROUP_ID,
  LOG_CHANNEL_ID,
  WATCHED_CHANNEL_IDS,
  WATCHED_USERGROUP_IDS,
} from "./constants";

const bannedUserIds = new Set<string>(BANNED_USER_IDS);
const watchedChannelIds = new Set<string>(WATCHED_CHANNEL_IDS);
const watchedUsergroupIds = new Set<string>(WATCHED_USERGROUP_IDS);

async function logChannelMembershipChange({
  action,
  channel,
  user,
}: {
  action: "joined" | "left";
  channel: string;
  user: string;
}) {
  if (!watchedChannelIds.has(channel)) return;

  await app.client.chat.postMessage({
    channel: LOG_CHANNEL_ID,
    text: `<@${user}> ${action} <#${channel}>`,
    blocks: [
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_section",
            elements: [
              { type: "user", user_id: user },
              { type: "text", text: ` ${action} ` },
              { type: "channel", channel_id: channel },
            ],
          },
        ],
      },
    ],
  });
}

type SubteamMembersChangedEvent = {
  subteam_id: string;
  added_users?: string[];
  removed_users?: string[];
};

type ReactionAddedEvent = {
  user: string;
  reaction: string;
  item: {
    type: string;
    channel?: string;
  };
};

function userListText(users: string[]) {
  return users.map((user) => `<@${user}>`).join(", ");
}

async function logUsergroupMembershipChange(
  event: SubteamMembersChangedEvent,
) {
  if (!watchedUsergroupIds.has(event.subteam_id)) return;

  const addedUsers = event.added_users ?? [];
  const removedUsers = event.removed_users ?? [];
  const changes = [
    addedUsers.length
      ? `Added: ${userListText(addedUsers)}`
      : undefined,
    removedUsers.length
      ? `Removed: ${userListText(removedUsers)}`
      : undefined,
  ].filter(Boolean);

  if (!changes.length) return;

  await app.client.chat.postMessage({
    channel: LOG_CHANNEL_ID,
    text: `Usergroup <!subteam^${event.subteam_id}> changed. ${changes.join(
      " ",
    )}`,
  });
}

// Initializes your app with your Slack app and bot token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: process.env.SLACK_SOCKET_MODE === "true",
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event("member_joined_channel", async ({ event }) => {
  await logChannelMembershipChange({
    action: "joined",
    channel: event.channel,
    user: event.user,
  });

  if (bannedUserIds.has(event.user)) {
    await app.client.conversations.kick({
      channel: event.channel,
      user: event.user,
    });
    return;
  }

  if (event.channel != CHANNEL_ID) return;

  await app.client.chat.postMessage({
    channel: event.channel,
    text: `everyone welcome <@${event.user}> to #kaihang-does-something! :ultrafastcatppuccinparrot:`,
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
                channel_id: "C0B4W8S1N3Z",
              },
              {
                type: "text",
                text: "! ",
              },
              {
                type: "emoji",
                name: "ultrafastcatppuccinparrot",
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
              text: ":ultrafastcatppuccinparrot:",
              emoji: true,
            },
            value: "ultrafastcatppuccinparrot",
            action_id: "ultrafastcatppuccinparrot",
          },
        ],
      },
    ],
  });

  const existingMembers = await app.client.usergroups.users.list({
    usergroup: GROUP_ID,
  });

  await app.client.usergroups.users.update({
    usergroup: GROUP_ID,
    users: [...(existingMembers.users || []), event.user].join(","),
  });

  await app.client.chat.postEphemeral({
    channel: event.channel,
    user: event.user,
    text: `hello! welcome to #ingo-commits-academic-fraud! :ultrafastcatppuccinparrot:
    this is where i yap about random stuff, and only rarely commit academic fraud.
    please read the rules!
    btw i added you to @kaihang-ping so you can pinged pung when i post interesting stuff.`,
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
                channel_id: "CHANNEL_ID",
              },
              {
                type: "text",
                text: "! ",
              },
              {
                type: "emoji",
                name: "ultrafastcatppuccinparrot",
              },
              {
                type: "text",
                text: "\nthis is where i yap about random stuff, and do something.\n",
              },
              {
                type: "text",
                text: "!\nbtw i added you to ",
              },
              {
                type: "usergroup",
                usergroup_id: "S0BFYQCUVK6",
              },
              {
                type: "text",
                text: " so you can ",
              },
              {
                type: "text",
                text: "pinged",
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
            },
            value: "remove_from_ping_group",
            action_id: "remove_from_ping_group",
          },
        ],
      },
    ],
  });
});

app.event("member_left_channel", async ({ event }) => {
  await logChannelMembershipChange({
    action: "left",
    channel: event.channel,
    user: event.user,
  });
});

app.event("subteam_members_changed", async ({ event }) => {
  await logUsergroupMembershipChange(event);
});

app.message("-67:", async ({ message, client, logger }) => {
  if (!("user" in message) || !message.user) return;
  if (!("channel" in message) || !message.channel) return;

  try {
    await client.conversations.kick({
      channel: message.channel,
      user: message.user,
    });
    await client.reactions.add({
      channel: message.channel,
      timestamp: message.ts,
      name: "ban"
    })
  } catch (error) {
    logger.error("Failed to kick user for -67: trigger", error);
  }
});

app.event("reaction_added", async ({ event, client, logger }) => {
  const reactionEvent = event as ReactionAddedEvent;

  if (!reactionEvent.reaction.endsWith("-67")) return;
  if (reactionEvent.item.type !== "message") return;
  if (!reactionEvent.item.channel) return;

  try {
    await client.conversations.kick({
      channel: reactionEvent.item.channel,
      user: reactionEvent.user,
    });
  } catch (error) {
    logger.error("Failed to kick user for -67 reaction trigger", error);
  }
});

app.action(
  "remove_from_ping_group",
  async ({ body, context, ack, respond }) => {
    await ack();

    const existingMembers = await app.client.usergroups.users.list({
      usergroup: GROUP_ID,
    });

    await app.client.usergroups.users.update({
      usergroup: GROUP_ID,
      users: (existingMembers.users || [])
        .filter((id) => id !== body.user.id)
        .join(","),
    });

    await respond({
      text: "Ok, you've been removed from the ping group.",
    });
  },
);

app.action(
  "ultrafastcatppuccinparrot",
  async ({ body, context, ack, respond, payload }) => {
    await ack();

    const message = (body as BlockAction).message;

    await respond({
      replace_original: false,
      delete_original: false,
      response_type: "in_channel",
      thread_ts: message?.ts,
      text:
        ":ultrafastcatppuccinparrot:".repeat(20) +
        `\nSent by <@${context.userId}>`,
      blocks: [
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_section",
              elements: Array(20).fill({
                type: "emoji",
                name: "ultrafastcatppuccinparrot",
              }),
            },
            {
              type: "rich_text_section",
              elements: [
                { type: "text", text: "Sent by " },
                { type: "user", user_id: context.userId },
              ],
            },
          ],
        },
      ],
    });
  },
);

(async () => {
  // Start your app
  await app.start();

  app.logger.info("⚡️ Bolt app is running!");
})();
