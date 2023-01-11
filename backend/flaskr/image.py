from . import db
from .journey import Journey
from .stage import Stage
from .event import Event

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    relationship_id = db.Column(db.Integer)
    type = db.Column(db.Text)
    filename = db.Column(db.Text)
    
    def __repr__(self):
        return '<Image %r>' % self.id

    def get_id(self):
        return self.id
    
    def get_relationship_id(self):
        return self.relationship_id
    
    def get_filename(self):
        return self.filename
