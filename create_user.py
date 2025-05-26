import json
import sys
from argparse import ArgumentParser

from dotenv import load_dotenv

from api._bcrypt import _bcrypt
from api.application import create_app
from api.model import Config, User, db

load_dotenv()

parser = ArgumentParser(
    "BeetMan User MGMT", description="User management for beetman API"
)
parser.add_argument("config")
parser.add_argument("username")
parser.add_argument("password")

args = parser.parse_args()

with open(args.config, "r", encoding="utf-8") as f:
    config_json = json.load(f)

app = create_app(Config(**config_json))

with app.app_context():
    db.create_all()

    existing_user = User.query.filter_by(username=args.username).one_or_none()
    if existing_user is not None:
        print(f"User with username {args.username} already exists")
        sys.exit(1)

    user = User(
        username=args.username, password=_bcrypt.generate_password_hash(args.password)
    )
    db.session.add(user)
    db.session.commit()
    db.close_all_sessions()
