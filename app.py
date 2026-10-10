import os

from dotenv import load_dotenv
from slack_bolt import App
from slack_bolt.adapter import socket_mode
from slack_bolt.adapter.socket_mode import SocketModeHandler

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
def handle_member_joined(event, say, logger):
    logger.info(f'oooo theres a event -> {event}')
    user_id = event['user']

    say(f'Everyone welcome <@{user_id}> to <{CHANNEL_ID}>! OI <@{OWNER_ID}> GET OVER HERE')

    say(f'<@{user_id} I\'ve added you to my pinggroup @kaihang-pings ')

@app.event('what is my slack id')
def slack_id(event, say, logger):
    logger.info(f'oooo theres a event -> {event}')
    user_id = event['user']

    say(f'Here\'s your slack id: {user_id}!')

@app.event("member_left_channel")
def
