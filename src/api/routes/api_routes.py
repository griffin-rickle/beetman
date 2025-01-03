from typing import Any, Dict, List, Union

from beets.library import LibModel
from flask import Blueprint, Response, current_app, jsonify, make_response, request
from flask_jwt_extended import jwt_required

api_routes = Blueprint("api", __name__)

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


@api_routes.route("/tracks/<track_name>", methods=["GET"])
@jwt_required()  # type: ignore
def query_track(track_name: str) -> Response:
    return make_response(
        jsonify(
            [
                library_model_to_json(track, track_fields)
                for track in current_app.config["beets_library"].get_tracks(
                    f"{track_name}"
                )
            ]
        ),
        200,
    )


@api_routes.route("/track/<track_id>", methods=["GET"])
@jwt_required()  # type:ignore
def get_track(track_id: int) -> Response:
    track = current_app.config["beets_library"].get_item(int(track_id))
    return make_response(jsonify(library_model_to_json(track, track_fields)), 200)


@api_routes.route("/track/<track_id>", methods=["POST"])
@jwt_required()  # type:ignore
def update_track(track_id: int) -> Response:
    item_updates = request.get_json()
    track = current_app.config["beets_library"].get_item(track_id)
    track.update({key: value for key, value in item_updates.items() if key != "id"})
    # Want the case where album doesn't exist here
    album_result = current_app.config["beets_library"].get_albums(
        f"album:={track.album}"
    )

    if len(album_result) > 1:
        return Response(
            f"more than one album found for query: {track.album}",
            status=500,
        )

    if len(album_result) == 1:
        # Album moving to new directory
        album = album_result[0]
    else:
        album = current_app.config["beets_library"].add_album([track])

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

    return make_response("track updated successfully", 200)


@api_routes.route("/albums/<album_name>", methods=["GET"])
@jwt_required()  # type:ignore
def query_album(album_name: str) -> Response:
    return make_response(
        jsonify(
            [
                library_model_to_json(album, album_fields)
                for album in current_app.config["beets_library"].get_albums(
                    f"album:{album_name}"
                )
            ]
        ),
        200,
    )


@api_routes.route("/album/<album_id>", methods=["GET"])
@jwt_required()  # type:ignore
def get_album(album_id: int) -> Response:
    album = current_app.config["beets_library"].get_album(int(album_id))
    return_value: Dict[str, Any] = library_model_to_json(album, album_fields)
    track_info: List[Dict[str, str]] = [
        {k: track[k] for k in ["title", "id", "track"]} for track in album.items()
    ]
    return_value["tracks"] = track_info

    return make_response(return_value, 200)


@api_routes.route("/album/<album_id>", methods=["POST"])
@jwt_required()  # type:ignore
def update_album(album_id: int) -> Response:
    album_updates = request.get_json()

    album_updates["album"] = album_updates["title"]
    del album_updates["title"]
    album = current_app.config["beets_library"].get_album(int(album_id))
    album.update({key: value for key, value in album_updates.items() if key != "id"})
    try:
        album.try_sync(True, True, True)
    except Exception:
        return Response(f"failed to write album {album.album} to disk", status=500)

    return make_response("Album updated successfully", 200)
