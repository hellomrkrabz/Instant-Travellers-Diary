from . import db
from datetime import datetime


class Stage(db.Model):
    __tablename__ = 'stages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    journey_id = db.Column(db.Integer, db.ForeignKey('journeys.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    events = db.relationship('Event',
                              backref='stage',
                              lazy='dynamic',
                              cascade="all, delete")

    def __repr__(self):
        return '<Stage %r>' % self.id

    def get_id(self):
        return self.id

    def get_name(self):
        return self.name

    def get_description(self):
        return self.description

    def get_journey_id(self):
        return self.journey_id

    def get_timestamp(self):
        return self.timestamp
