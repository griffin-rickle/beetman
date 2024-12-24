from flask import Blueprint, Response, current_app, jsonify, make_response, request
from flask_jwt_extended import create_access_token

from api._bcrypt import _bcrypt
from api.model.model import User

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/login", methods=["POST"])
def user_login() -> Response:
    req_json = request.get_json()
    username = req_json["username"]
    password = req_json["password"]
    print(f"Received login request with username {req_json['username']}")
    print(f"Received login request with password {req_json['password']}")
    user = User.query.filter_by(username=username).one_or_none()
    if not user or not _bcrypt.check_password_hash(user.password, password):
        return make_response("Wrong username or password", 401)

    return make_response(
        jsonify({"access_token": create_access_token(identity=user.username)}), 200
    )


# @auth_routes.rotue("/token_identity", methods=["POST"])
# def validate_token() -> Boolean:
#
