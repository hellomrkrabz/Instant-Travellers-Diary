from . import db
from datetime import datetime


class Journey(db.Model):
    __tablename__ = 'journeys'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
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

    def get_body(self):
        return self.body

    def get_body_html(self):
        return self.body_html

    def get_author_id(self):
        return self.author_id
