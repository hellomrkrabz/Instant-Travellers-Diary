from profile import Profile
from . import db
from datetime import datetime

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .config import config

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(64))
    bio = db.Column(db.Text())
    avatar_hash = db.Column(db.String(32))
    # journeys = db.relationship('Journey', backref='author', lazy='dynamic')
    # events = db.relationship('Event', backref='author', lazy='dynamic')
    # def __init__(self, username: str, profile: Profile):
    #     self.username = username
    #     self.profile = profile

    def __repr__(self):
        return '<User %r>' % self.username


app = Flask(__name__, instance_relative_config=True)
app.config.from_object(config['development'])
db = SQLAlchemy(app)

with app.app_context():
    db.create_all()

    db.session.add(User(username = 'test1', email = 'test1@example.com', password_hash = "test"))
    db.session.add(User(username = 'test2', email = 'test2@example.com', password_hash = "test"))

    db.session.commit()

    users = User.query.all()
    print(users)
