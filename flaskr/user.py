from profile import Profile
from . import db
from datetime import datetime

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
