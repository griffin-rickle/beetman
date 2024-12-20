from flask import Blueprint, Response, current_app, request

auth_routes = Blueprint("auth", __name__)

@auth_routes.route("/login", methods=["POST"])
def user_login() -> Response:
    req_json = request.get_json()
    print(f"Received login request with username {req_json['username']}")
    print(f"Received login request with password {req_json['password']}")

    return Response("test token", 200)
