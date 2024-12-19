from flask_sqlalchemy import SQLAlchemy


def init_db(db: SQLAlchemy) -> None:
    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(20), unique=True, nullable=False)
        password = db.Column(db.String(80), nullable=False)

        def __repr__(self) -> str:
            return f"<User {self.username}>"
