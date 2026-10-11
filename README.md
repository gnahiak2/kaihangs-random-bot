# Nibble

A Slack bot for `#kaihangs-shitdump`, built with [Slack Bolt for Python](https://slack.dev/bolt-python/) and running over Socket Mode.

Name contributed by @Koy. Canonically a Catenby.

## What it does

- **Welcomes new members** — greets anyone joining the channel and pings the owner.
- **Auto-manages the ping group** — adds new members to a Slack user group so they get pinged, and shows them an ephemeral message with an **Opt out of pings** button to leave it again.
- **Says goodbye** when someone leaves the channel.
- **Answers `slack id`** — replies with your Slack user ID when you type `what is my slack id`, `slack id`, or `my slack id`.

## Requirements

- Python 3.10+
- A Slack app with Socket Mode enabled and the manifest in [`manifest.yaml`](./manifest.yaml)

## Setup

### 1. Create the Slack app

Create a Slack app from your workspace's app page and apply the configuration in [`manifest.yaml`](./manifest.yaml). It requests these bot scopes:

| Scope | Used for |
| --- | --- |
| `chat:write` | Posting messages |
| `channels:history`, `groups:history`, `mpim:read` | Receiving messages |
| `channels:read`, `groups:read` | Reading channel info |
| `reactions:read`, `reactions:write` | Reactions |
| `usergroups:read`, `usergroups:write` | Managing the ping user group |
| `channels:manage` | Channel management |

Enable **Socket Mode**, then install the app to your workspace and copy the **Bot User OAuth Token** (`xoxb-...`). Generate an **App-Level Token** with the `connections:write` scope (`xapp-...`) and grab the **Signing Secret** from *Basic Information*.

### 2. Configure environment variables

Copy the example env file and fill in your tokens:

```bash
cp .env.example .env
```

```env
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
SLACK_SIGNING_SECRET=...
```

### 3. Set your IDs

Edit [`constants.py`](./constants.py) to point at your own workspace:

```python
CHANNEL_ID = "C0B4W8S1N3Z"  # the channel to watch
GROUP_ID   = "S0BFYQCUVK6"  # the user group to manage
OWNER_ID   = "U08EGTXVCFR"  # pinged when someone joins
```

## Running

### Locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

### With Docker

```bash
docker compose up --build -d
docker compose logs -f
```

The container is named `nibble-slack-bot`, restarts automatically, and runs as a non-root user.

## Development

Linting and formatting are handled with [Ruff](https://docs.astral.sh/ruff/) (line length 125, double quotes), and tests with pytest — both configured in [`pyproject.toml`](./pyproject.toml).

```bash
ruff check .
ruff format .
pytest
```

## Project layout

```
.
├── main.py            # App entrypoint, event and action handlers
├── constants.py       # Channel / user group / owner IDs
├── manifest.yaml      # Slack app manifest
├── requirements.txt   # Python dependencies
├── pyproject.toml     # Ruff + pytest config
├── Dockerfile         # Multi-stage, non-root image
└── compose.yml        # Docker Compose service
```

## License

[MIT](./LICENSE) © 2026 Kaihang
