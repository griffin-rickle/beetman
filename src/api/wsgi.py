# wsgi.py
import json
import os

from dotenv import load_dotenv

from api.application import create_app
from api.model import Config

load_dotenv()

# Load default config path or env-based path
config_path = os.environ.get("BEETMAN_CONFIG", "config.json")

with open(config_path, "r", encoding="utf-8") as f:
    config = Config(**json.load(f))

static_folder = os.path.join(os.path.dirname(__file__), "src", "api", "static")

app = create_app(config, static_folder=static_folder)
