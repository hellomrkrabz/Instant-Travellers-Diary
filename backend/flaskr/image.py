from . import db
from .journey import Journey
from .stage import Stage
from .event import Event

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('journeys.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    stage_id = db.Column(db.Integer, db.ForeignKey('stages.id'))
    full_filename = db.Column(db.Text)
    
    def __repr__(self):
        return '<Image %r>' % self.id

    def get_id(self):
        return self.id
    
    def get_journey_id(self):
        return self.journey_id
    
    def get_event_id(self):
        return self.event_id
    
    def get_stage_id(self):
        return self.stage_id
    
    def get_full_filename(self):
        return self.full_filename
    
class Avatar(db.Model):
    __tablename__ = 'avatars'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    full_filename = db.Column(db.Text)
    
    def __repr__(self):
        return '<Avatar %r>' % self.id

    def get_id(self):
        return self.id
    
    def get_user_id(self):
        return self.user_id
    
    def get_full_filename(self):
        return self.full_filename