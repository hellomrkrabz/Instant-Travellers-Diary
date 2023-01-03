import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from .config import config

db = SQLAlchemy()
IMAGE_UPLOAD_FOLDER = '../public/images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_object(config['development'])
    config['development'].init_app(app)
    app.config['IMAGE_UPLOAD_FOLDER'] = IMAGE_UPLOAD_FOLDER

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

    # blueprint responsible for fetching some data from the API
    from . import api
    app.register_blueprint(api.bp)

    # blueprint responsible for registering and logging
    from . import auth
    app.register_blueprint(auth.bp)

    # blueprint responsible for profile manipulation
    from . import profile
    app.register_blueprint(profile.bp)

    db.init_app(app)

    # create database tables
    with app.app_context():
        db.create_all()

    return app

@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER,'test_docs')
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload`")
    file = request.files['file']
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    response="Whatever you wish too return"
    return response
