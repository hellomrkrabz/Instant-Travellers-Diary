import os
from flask import Flask, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from .config import config

db = SQLAlchemy()


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_object(config['development'])
    config['development'].init_app(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/api/users/<id>', methods=['GET'])
    def test(id):
        user = User.query.filter_by(id=id).first()
        return {
            "username": user.get_username(),
            "email": user.get_email()
        }

    # blueprint responsible for registering and logging
    from . import auth
    app.register_blueprint(auth.bp)

    # blueprint responsible for profile manipulation
    from . import profile
    app.register_blueprint(profile.bp)

    db.init_app(app)

    #create database tables
    with app.app_context():
        db.create_all()

    return app
