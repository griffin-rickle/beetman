import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS

from api._bcrypt import _bcrypt
from api._beets import LibraryWrapper
from api._jwt import CookieJWTManager
from api.model import Config, db
from api.routes.api_routes import api_routes
from api.routes.auth_routes import auth_routes
from api.routes.frontend_routes import frontend_routes


def create_app(config: Config, static_folder: str = "static") -> Flask:
    app = Flask("beetman", static_folder=static_folder, static_url_path="")

    # Beets specific configuration
    beet_config = config.beets
    app.config["beets_library"] = LibraryWrapper(
        beet_config.library_db_path,
        beet_config.library_directory,
        beet_config.library_path_format,
    )

    # SQLAlchemy configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # JWT specific configuration
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    # app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]

    CORS(app)

    app.secret_key = os.environ["SECRET_KEY"]

    db.init_app(app)
    _jwt = CookieJWTManager()
    _jwt.init_app(app)
    _bcrypt.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(api_routes, url_prefix="/api")
    app.register_blueprint(auth_routes, url_prefix="/auth")
    app.register_blueprint(frontend_routes)

    return app
