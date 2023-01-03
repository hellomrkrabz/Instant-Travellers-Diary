from . import db
from datetime import datetime


class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'))
    # images = db.relationship('Images',
    #                          backref='event',
    #                          lazy='dynamic',
    #                          cascade="all, delete")