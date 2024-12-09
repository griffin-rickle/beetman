from typing import Any, Dict, List, Union

from beets.library import LibModel, Library
from beets.ui import commands
from flask import Flask
from flask_cors import CORS

beets_library = Library(
    path="/home/griff/Downloads/test_library_path",
    directory="/home/griff/Downloads/test_library_directory",
)

app = Flask(__name__)
CORS(app)
app.secret_key = "7dcbc0cdd9fb2339588460bb3ab7f0241e7cbfbcfe8a679666232d9bf869a975"

# TODO: Come up with a type that isn't a piece of shit Union[Dict[str, str], str]
track_fields: List[str] = ["id", "title", "album", "artist", "track", "year"]
album_fields: List[Union[Dict[str, str], str]] = [
    "id",
    dict({"album": "title"}),
    "albumartist",
    "genre",
    "day",
    "month",
    "year",
    "added",
]


def library_model_to_json(
    model: LibModel, keys: List[Union[Dict[str, str], str]]
) -> Dict[str, Union[str, int]]:
    to_return: Dict[str, Any] = {}
    for key in keys:
        if isinstance(key, dict):
            for tx_key, return_key in key.items():
                value = model[tx_key]
                to_return[return_key] = value
        else:
            to_return[key] = model[key]
    return to_return


# Use the beets UI query functionality to do all of this shit.
# It's already written so why not?
# https://beets.readthedocs.io/en/stable/reference/query.html
# https://github.com/beetbox/beets/blob/master/beets/ui/commands.py
@app.route("/tracks/<track_name>", methods=["GET"])
def query_track(track_name: str) -> Dict[str, Any]:
    return {
        "result": [
            library_model_to_json(item, track_fields)
            # pylint:disable=protected-access
            for item in commands._do_query(
                beets_library, f"title:{track_name}", False, also_items=False
            )[0]
        ]
    }


@app.route("/track/<track_id>", methods=["GET"])
def get_track(track_id: int) -> Dict[str, Any]:
    return library_model_to_json(beets_library.get_item(track_id), track_fields)


@app.route("/albums/<album_name>", methods=["GET"])
def query_album(album_name: str) -> Dict[str, Any]:
    return {
        "result": [
            library_model_to_json(album, album_fields)
            # pylint:disable=protected-access
            for album in commands._do_query(
                beets_library, f"album:{album_name}", True, False
            )[1]
        ]
    }


@app.route("/album/{<album_id>/tracks", method=["GET"])
def get_album_tracks(album_id: int) -> Dict[str, List[Dict[str, Any]]]:
    return {
        "results": [
            library_model_to_json(item, track_fields)
            for item in beets_library.get_album(album_id).items()
        ]
    }
