import os

from flask import Blueprint, Response, current_app, send_from_directory

frontend_routes = Blueprint("frontend", __name__)


@frontend_routes.route("/", defaults={"path": ""})
@frontend_routes.route("/<string:path>")
@frontend_routes.route("/<path:path>")
@frontend_routes.route("/track/<path:path>")
@frontend_routes.route("/album/<path:path>")
@frontend_routes.route("/tracks/<path:path>")
@frontend_routes.route("/albums/<path:path>")
def serve_frontend(path: str) -> Response:
    if not current_app.static_folder:
        bad_resp = Response()
        bad_resp.status_code = 500
        return bad_resp
    if path and current_app.static_folder:
        full_path = os.path.join(current_app.static_folder, path)
        if os.path.exists(full_path):
            return send_from_directory(current_app.static_folder, path)
    return send_from_directory(current_app.static_folder, "index.html")
