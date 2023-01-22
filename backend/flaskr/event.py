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
    latitude = db.Column(db.Float, default=50.2944923)
    longitude = db.Column(db.Float, default=18.6713802)
    public = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<Stage %r>' % self.id

    def __lt__(self, other):
        return self.timestamp.date() < other.timestamp.date()

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
        return str(self.timestamp.date())

    def get_lat(self):
        return self.latitude

    def get_lng(self):
        return self.longitude

    def is_public(self):
        return self.public
