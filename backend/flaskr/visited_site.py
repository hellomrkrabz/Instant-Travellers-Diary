from . import db


class VisitedSite(db.Model):
    __tablename__ = 'sites'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    public = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<Site %r>' % self.id

    def get_id(self):
        return self.id

    def get_description(self):
        return self.description

    def get_event_id(self):
        return self.event_id

    def is_public(self):
        return self.public
