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

track_fields = ["id", "title", "album", "artist", "track", "year"]
album_fields = ["id", "album", "albumartist", "genre", "day", "month", "year", "added"]


def library_model_to_json(
    model: LibModel, keys: List[str]
) -> Dict[str, Union[str, int]]:
    return {key: model[key] for key in keys}


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
