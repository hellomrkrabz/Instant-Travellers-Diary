# from profile import Profile
from . import db
# from datetime import datetime

# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from .config import config

from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_utils import EmailType

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(EmailType, unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(64))
    bio = db.Column(db.Text())
    avatar = db.Column(db.String(128))
    journeys = db.relationship('Journey',
                               backref='author',
                               lazy='dynamic',
                               cascade="all, delete")

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

    def get_avatar(self):
        return self.avatar
        
    def get_bio(self):
        return self.bio

    def set_password_hash(self, new_password):
        self.password_hash = generate_password_hash(new_password)
