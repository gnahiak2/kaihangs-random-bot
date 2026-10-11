import os

from dotenv import load_dotenv
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from slack_bolt.context import say
from slack_sdk.errors import SlackApiError

from constants import CHANNEL_ID, GROUP_ID, OWNER_ID

load_dotenv()

slack_app_token = os.getenv("SLACK_APP_TOKEN")
slack_bot_token = os.getenv("SLACK_BOT_TOKEN")
slack_signing_secret = os.getenv("SLACK_SIGNING_SECRET")

app = App(
    token = slack_bot_token,
    signing_secret = slack_signing_secret
)

@app.event("member_joined_channel")
def handle_member_joined(event, say, logger, client):
    logger.info(f'oooo theres a event -> {event}')
    user_id = event['user']
    joined_channel = event['channel']

    if joined_channel != CHANNEL_ID:
        return

    say(f'Everyone welcome <@{user_id}> to <#{CHANNEL_ID}>! OI <@{OWNER_ID}> GET OVER HERE')

    try:
        # 1. Fetch current users in the User Group
        current_users_resp = client.usergroups_users_list(usergroup=GROUP_ID)
        current_users = current_users_resp.get("users", [])

        # 2. Add the new user if they aren't already in the group
        if user_id not in current_users:
            current_users.append(user_id)
            client.usergroups_users_update(usergroup=GROUP_ID, users=current_users)
            logger.info(f"Added user {user_id} to group {GROUP_ID}")

        # 3. Post an ephemeral message visible ONLY to the joining user
        client.chat_postEphemeral(
            channel=CHANNEL_ID,
            user=user_id,
            text=f"Welcome! You've been added to the pinggroup.",
            blocks=[
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"Hi <@{user_id}>! Welcome to <#{CHANNEL_ID}>! This is where Kaihang excessivly pings you!"
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Opt out of pings"
                            },
                            "style": "danger",
                            "action_id": "opt_out_pings",
                            "value": GROUP_ID # Pass group ID through the button value
                        }
                    ]
                }
            ]
        )

    except SlackApiError as e:
        logger.error(f"Error handling channel join: {e.response['error']}")
@app.action("opt_out_pings")
def handle_opt_out(ack, body, client, respond, logger):
    """
    Triggers when the user clicks 'Opt out of pings'.
    Removes them from the usergroup and updates the ephemeral message.
    """
    # Acknowledge the interactive action immediately
    ack()

    user_id = body["user"]["id"]
    usergroup_id = body["actions"][0]["value"]

    try:
        # 1. Fetch current members
        current_users_resp = client.usergroups_users_list(usergroup=usergroup_id)
        current_users = current_users_resp.get("users", [])

        # 2. Remove the user if they exist in the group
        if user_id in current_users:
            current_users.remove(user_id)
            client.usergroups_users_update(usergroup=usergroup_id, users=current_users)
            logger.info(f"Removed user {user_id} from group {usergroup_id}")

        # 3. Update the original ephemeral message to confirm removal using response_url
        respond(
            text="You have successfully opted out of pings and been removed from the group.",
            replace_original=True
        )

    except SlackApiError as e:
        logger.error(f"Error handling opt out: {e.response['error']}")
        respond(text="⚠️ Failed to remove you from the group. Please contact an admin.", replace_original=False)




@app.message('what is my slack id')
def slack_id_1(event, say, logger):
    logger.info(f'oooo theres a event -> {event}')
    user_id = event['user']

    say(f'Here\'s your slack id: {user_id}!')

@app.message('slack id')
def slack_id_2(event, say, logger):
    logger.info(f'oooo theres a event -> {event}')
    user_id = event['user']

    say(f'Here\'s your slack id: {user_id}!')

@app.message('my slack id')
def slack_id_3(event, say, logger):
    logger.info(f'oooo theres a event -> {event}')
    user_id = event['user']

    say(f'Here\'s your slack id: {user_id}!')

@app.event("member_left_channel")
def handle_left_member(event, say, logger):
    logger.info(f'oooo theres a event -> {event}')
    user_id = event['user']

    say(f'Bye <@{user_id}>! It was nice having you in <#{CHANNEL_ID}>!')

if __name__ == "__main__":
    handler = SocketModeHandler(app, slack_app_token)
    handler.start()
