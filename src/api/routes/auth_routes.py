from flask import Blueprint, Response, current_app, jsonify, make_response, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
)

from api._bcrypt import _bcrypt
from api.model.model import User

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/login", methods=["POST"])
def user_login() -> Response:
    req_json = request.get_json()
    username = req_json["username"]
    password = req_json["password"]
    user = User.query.filter_by(username=username).one_or_none()
    if not user or not _bcrypt.check_password_hash(user.password, password):
        return make_response("Wrong username or password", 401)

    response = make_response(jsonify(user.username), 200)
    access_token = create_access_token(identity=user.username)
    set_access_cookies(response, access_token)
    return response


@auth_routes.route("/token_check", methods=["GET"])
@jwt_required()  # type: ignore
def token_check() -> Response:
    current_user = get_jwt_identity()
    return make_response(jsonify(logged_in_as=current_user), 200)
