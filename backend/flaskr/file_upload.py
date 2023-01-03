from flask import (
    Blueprint,
    request,
    session,
    jsonify
)
from werkzeug.utils import secure_filename
import os

from .image import Image


bp = Blueprint("upload", __name__, url_prefix="/upload")


ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif']

@bp.route('/image', methods=['POST'])
def upload_file():
    target = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    target = os.path.join(target, 'public', 'images')
    
    if not os.path.isdir(target):
        os.mkdir(target)
    
    data = request.get_json()
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
    
    destination = "\\".join([target, filename])
    
    if not os.path.isfile(destination):
        file.save(destination)
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
    else:
        return jsonify({
            "msg": f"File with the name {file.filename} already exists. Change the name and try again."
        })
        
@bp.route('/avatar', methods=['POST'])
def upload_avatar():
    target = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    target = os.path.join(target, 'public', 'avatars')
    
    if not os.path.isdir(target):
        os.mkdir(target)
    
    data = request.get_json()
    u_id = data['userID']
    
    file = request.files['file']
    extension = file.filename.split('.')[-1]
    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"msg": f"Invalid extension: {extension}"})
    
    filename = f"{u_id}.{extension}"
    filename = secure_filename(filename)
    
    destination = "\\".join([target, filename])
    
    if not os.path.isfile(destination):
        file.save(destination)
        avatar = Avatar(
            user_id=u_id,
            full_filename=destination
        )
        db.session.add(avatar)
        db.session.commit()
        print(f"[INFO] Avatar {destination} saved successfully")
        
        return jsonify({"msg": "success"})
    else:
        return jsonify({
            "msg": f"File with the name {file.filename} already exists. Change the name and try again."
        })