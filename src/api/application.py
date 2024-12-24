from flask import Flask
from flask_cors import CORS

from api._bcrypt import _bcrypt
from api._beets import LibraryWrapper
from api._jwt import _jwt
from api.model import Config, db
from api.routes.api_routes import api_routes
from api.routes.auth_routes import auth_routes


def create_app(config: Config) -> Flask:
    app = Flask("beetman-api")

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
    app.config["SECRET_KEY"] = "123asd"
    app.config["JWT_SECRET_KEY"] = "123asd"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    CORS(app)

    app.secret_key = "7dcbcdd9fb23395884bb3ab7241e7cbfbcfe8a679666232d9bf869a975"

    db.init_app(app)
    _jwt.init_app(app)
    _bcrypt.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(api_routes)
    app.register_blueprint(auth_routes)

    return app
