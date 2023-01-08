import os

from flask import (
    Blueprint,
    request,
    jsonify
)
from werkzeug.utils import secure_filename

from . import db
#from .image import Image, Avatar
from .image import Image
from .user import User


bp = Blueprint("upload", __name__, url_prefix="/api/upload")

ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif']


@bp.route('/image', methods=['POST'])
def upload_file():
    target = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    target = os.path.join(target, 'public', 'images')

    if not os.path.isdir(target):
        os.mkdir(target)

    data = request.form

    j_id = data['journeyID']
    s_id = data['stageID']
    e_id = data['eventID']

    file = request.files['file']
    extension = file.filename.split('.')[-1]
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"msg": f"Invalid extension: {extension}"})

    hashed = abs(hash(file.filename)) % 10 ** 6

    filename = f"{j_id}_{s_id}_{e_id}_{hashed}.{extension}"
    filename = secure_filename(filename)

    destination = os.path.join(target, filename)

    if not os.path.isfile(destination):
        file.save(os.path.abspath(destination))
        image = Image(
            journey_id=j_id,
            stage_id=s_id,
            event_id=e_id,
            full_filename=destination
        )
        db.session.add(image)
        db.session.commit()
        print(f"[INFO] File {destination} saved successfully")

        return jsonify({"msg": "success"})

    return jsonify({
        "msg": f"File with the name {file.filename} already exists. Change the name and try again."
    })

@bp.route('/avatar', methods=['POST'])
def upload_avatar():
    target = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    #target = os.path.join(target, 'public', 'avatars')
    target = '\\avatars'

    if not os.path.isdir(target):
        os.mkdir(target)

    user_id = request.form['userID']
    user = User.query.filter_by(id=user_id).first()

    file = request.files['file']
    extension = file.filename.split('.')[-1]
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"msg": f"Invalid extension: {extension}"})

    filename = f"{user_id}.{extension}"
    filename = secure_filename(filename)

    destination = os.path.join(target, filename)

    #if not os.path.isfile(destination):
    user.avatar = destination
    db.session.commit()

    file.save(os.path.abspath(destination))
    print(f"[INFO] Avatar {destination} saved successfully")

    return jsonify({"msg": "success"})