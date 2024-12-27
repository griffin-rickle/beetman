from datetime import datetime, timedelta, timezone

from flask import Flask, Response
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
)


class CookieJWTManager:
    def __init__(self) -> None:
        self._jwt = JWTManager()

    def init_app(self, app: Flask) -> None:
        self._jwt.init_app(app)

        @app.after_request
        def refresh_expiring_jwts(response: Response) -> Response:
            response.access_control_allow_credentials = True
            try:
                exp_timestamp = get_jwt()["exp"]
                now = datetime.now(timezone.utc)
                target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
                if target_timestamp > exp_timestamp:
                    access_token = create_access_token(identity=get_jwt_identity())
                    set_access_cookies(response, access_token)
                return response
            except (RuntimeError, KeyError):
                # Case where there is not a valid JWT. Just return the original response
                return response
