from . import db
from datetime import datetime


class Journey(db.Model):
    __tablename__ = 'journeys'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer)
    description = db.Column(db.Text)
    journey_image = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    initial_date = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    stages = db.relationship('Stage',
                             backref='journey',
                             lazy='dynamic',
                             cascade="all, delete")
    # images = db.relationship('Images',
    #                          backref='journey',
    #                          lazy='dynamic',
    #                          cascade="all, delete")
    # comments = db.relationship('Comment', backref='post', lazy='dynamic')

    def __repr__(self):
        return '<Journey %r>' % self.id

    def get_id(self):
        return self.id

    def get_name(self):
        return self.name

    def get_description(self):
        return self.description

    def get_journey_image(self):
        return self.journey_image

    def get_author_id(self):
        return self.author_id

    def get_initial_date(self):
        return self.initial_date
    def get_end_date(self):
        return self.end_date