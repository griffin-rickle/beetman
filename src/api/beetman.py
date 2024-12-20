import json
import os
from argparse import ArgumentParser

from flask import Flask
from flask_cors import CORS

from api.model import Config, LibraryWrapper
from api.routes.api_routes import api_routes
from api.routes.auth_routes import auth_routes

parser = ArgumentParser(
    prog="BeetMan API", description="Web API for Beets Python Library Manager"
)
parser.add_argument("config")


def get_config(path: str) -> Config:
    print(os.getcwd())
    with open(path, "r", encoding="utf-8") as f:
        config_json = json.load(f)

    return Config(**config_json)


def main() -> None:
    args = parser.parse_args()
    config = get_config(args.config)
    beet_config = config.beets

    app = Flask(__name__)
    app.config["beets_library"] = LibraryWrapper(
        beet_config.library_db_path,
        beet_config.library_directory,
        beet_config.library_path_format,
    )

    CORS(app)
    app.secret_key = "7dcbcdd9fb23395884bb3ab7241e7cbfbcfe8a679666232d9bf869a975"
    app.register_blueprint(api_routes)
    app.register_blueprint(auth_routes)
    app.run()


if __name__ == "__main__":
    main()
