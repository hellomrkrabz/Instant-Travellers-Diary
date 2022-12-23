# from profile import Profile
from . import db
# from datetime import datetime

# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from .config import config

from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(64))
    bio = db.Column(db.Text())
    avatar_hash = db.Column(db.String(32))
    journeys = db.relationship('Journey',
                               backref='author',
                               lazy='dynamic',
                               cascade="all, delete")
    # events = db.relationship('Event', backref='author', lazy='dynamic')
    # def __init__(self, username: str, profile: Profile):
    #     self.username = username
    #     self.profile = profile

    def __repr__(self):
        return '<User %r>' % self.username

    def verify_password(self, password) -> bool:
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return self.id

    def get_username(self):
        return self.username

    def get_email(self):
        return self.email

    def set_password_hash(self, new_password):
        self.password_hash = generate_password_hash(new_password)
