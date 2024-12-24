import json
import os
from argparse import ArgumentParser

from api.application import create_app
from api.model import Config

parser = ArgumentParser(
    prog="BeetMan API", description="Web API for Beets Python Library Manager"
)
parser.add_argument("config")


def get_config(path: str) -> Config:
    with open(path, "r", encoding="utf-8") as f:
        config_json = json.load(f)

    return Config(**config_json)


def main() -> None:
    args = parser.parse_args()
    config = get_config(args.config)

    app = create_app(config)
    app.run()


if __name__ == "__main__":
    main()
