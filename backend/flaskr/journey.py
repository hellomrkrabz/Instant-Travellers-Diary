from . import db
from datetime import datetime


class Journey(db.Model):
    __tablename__ = 'journeys'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer)
    description = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    initial_date = db.Column(db.DateTime, default=datetime.date)
    end_date = db.Column(db.DateTime, default=datetime.date)
    stages = db.relationship('Stage',
                             backref='journey',
                             lazy='dynamic',
                             cascade="all, delete")

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
        return str(self.initial_date.date())

    def get_end_date(self):
        return str(self.end_date.date())

    def get_initial_date_datetime(self):
        return self.initial_date.date()

    def get_end_date_datetime(self):
        return self.end_date.date()
