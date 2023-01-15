from . import db
from datetime import datetime


class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    journey_id = db.Column(db.Integer, db.ForeignKey('journeys.id'))
    stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

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

    def get_stage_id(self):
        return self.journey_id

    def get_timestamp(self):
        return self.timestamp
