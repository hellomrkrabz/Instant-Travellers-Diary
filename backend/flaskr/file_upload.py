import os

from flask import (
    Blueprint,
    request,
    jsonify
)
from werkzeug.utils import secure_filename

from . import db
from .image import Image
from .user import User
import random
import string

bp = Blueprint("upload", __name__, url_prefix="/api/upload")

ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif']


@bp.route('/image', methods=['POST'])
def upload_file():
    target = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    target = os.path.join(target, 'public', 'images')
    target2 = '/images'

    if not os.path.isdir(target):
        os.mkdir(target)

    id = request.form['id']
    image_type = request.form['type']
    file = request.files['file']

    extension = file.filename.split('.')[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"msg": f"Invalid extension: {extension}"})
    print("trying to upload image")
    while True:
        hashed = abs(
            hash(
                str(file.filename + random.choice(string.ascii_letters))
            )
        ) % (10 ** 9)

        filename = f"{hashed}.{extension}"
        filename = secure_filename(filename)

        destination = os.path.join(target, filename)
        destination2 = os.path.join(target2, filename)

        if not os.path.isfile(destination):
            file.save(os.path.abspath(destination))
            image = Image(
                relationship_id=id,
                type=image_type.lower(),
                filename=destination2
            )
            db.session.add(image)
            db.session.commit()
            print(f"[INFO] File {destination2} saved successfully")

            return jsonify({"msg": "success"})


@bp.route('/avatar', methods=['POST'])
def upload_avatar():
    target = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    target = os.path.join(target, 'public', 'avatars')
    target2 = '/avatars'

    if not os.path.isdir(target):
        os.mkdir(target)

    user_id = request.form['userID']
    user = User.query.filter_by(id=user_id).first()

    file = request.files['file']
    extension = file.filename.split('.')[-1]
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"msg": f"Invalid extension: {extension}"})
    dest = os.path.join(target, f"{user_id}.{extension}")
    print(dest)
    if os.path.isfile(dest) and os.path.exists(dest):
        try:
            os.remove(dest)
        except OSError as e:
            print("Failed with:", e.strerror)
            return jsonify({
                "msg":
                f"Could not delete the file {dest} while saving an avatar"
            })
    filename = f"{user_id}.{extension}"
    filename = secure_filename(filename)

    destination = os.path.join(target, filename)
    destination2 = os.path.join(target2, filename)
    user.avatar = destination2
    db.session.commit()

    file.save(os.path.abspath(destination))
    print(f"[INFO] Avatar {destination} saved successfully")

    return jsonify({"msg": "success"})
