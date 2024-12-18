import json
from io import BytesIO
from typing import Any, Dict, List, Union

from beets.library import LibModel
from flask import Flask, Response, request
from flask_cors import CORS
from model.lib_wrapper import LibraryWrapper

beets_library = LibraryWrapper(
    "/home/griff/Downloads/test_library_path",
    "/home/griff/Downloads/test_library_directory",
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


@app.route("/tracks/<track_id>", methods=["GET"])
def get_track(track_id: int) -> Dict[str, Any]:
    track = beets_library.get_item(int(track_id))
    return {"result": [library_model_to_json(track, track_fields)]}


# Why does this not work if I update the album to Diotima-test?
@app.route("/tracks/<track_id>", methods=["POST"])
def update_track(track_id: int) -> Response:
    try:
        item_updates = json.load(BytesIO(request.data))
    except Exception:
        return Response("An error occurred parsing request body", status=500)
    track = beets_library.get_item(track_id)
    track.update({key: value for key, value in item_updates.items() if key != "id"})
    # Want the case where album doesn't exist here
    album_result = beets_library.get_albums(f"album:={track.album}")

    if len(album_result) > 1:
        return Response(
            f"more than one album found for query: {track.album}",
            status=500,
        )

    if len(album_result) == 1:
        # Album moving to new directory
        album = album_result[0]
    else:
        album = beets_library.add_album([track])

    track.update({"album_id": album.id})

    # write new album directory; this also moves the track to that folder
    try:
        album.try_sync(True, True, True)
    except Exception:
        return Response(
            f"failed to write album {album.album} to disk",
            status=500,
        )
    try:
        track.try_sync(True, True, with_album=True)
    except Exception:
        return Response(
            f"An error occurred when writing track with id {track_id} to disk",
            status=500,
        )

    return Response("track updated successfully", status=200)


@app.route("/albums/<album_name>", methods=["GET"])
def query_album(album_name: str) -> Dict[str, Any]:
    return {
        "result": [
            library_model_to_json(album, album_fields)
            for album in beets_library.get_albums(f"album:{album_name}")
        ]
    }


@app.route("/album/<album_id>", methods=["GET"])
def get_album(album_id: int) -> Dict[str, List[Dict[str, Any]]]:
    album = beets_library.get_album(int(album_id))
    return_value: Dict[str, Any] = library_model_to_json(album, album_fields)
    track_info: List[Dict[str, str]] = [
        {k: track[k] for k in ["title", "id", "track"]} for track in album.items()
    ]
    return_value["tracks"] = track_info

    return {"result": [return_value]}


@app.route("/album/<album_id>", methods=["POST"])
def update_album(album_id: int) -> Response:
    try:
        album_updates = json.load(BytesIO(request.data))
    except Exception:
        return Response("An error occurred parsing request body", 500)

    album_updates["album"] = album_updates["title"]
    del album_updates["title"]
    album = beets_library.get_single_album(f"id:{album_id}")
    album.update({key: value for key, value in album_updates.items() if key != "id"})
    try:
        album.try_sync(True, True, True)
    except Exception:
        return Response(f"failed to write album {album.album} to disk", status=500)

    return Response("Album updated successfully", status=200)
