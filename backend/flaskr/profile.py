from flask import (
    Blueprint,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
    jsonify
)

# from flaskr.db import get_db
# from flaskr.auth import convertToBinaryData

from . import db
from .user import User

bp = Blueprint("profile", __name__, url_prefix="/profile")

@bp.route('/get_data/<id>', methods=['GET'])
def test(id):
    user = User.query.filter_by(id=id).first()
    return {
        "username": user.get_username(),
        "email": user.get_email()
    }

@bp.route("/EditProfile", methods=["POST"])
def EditProfile():
    data         = request.get_json()
    username     = data['username']
    email        = data['email']
    password     = data['password']
    new_password = data['newPassword']
    user_id      = session.get("user_id") or data['userID']

    if user_id is None:
        return jsonify({'msg': f"Couldn\'t find user with id {user_id}"})

    error = None
    try:
        user = User.query.filter_by(id=user_id).first()

        if password == '':
            error = "Password is required"
        elif not user.verify_password(password):
            error = "Password is incorrect"

        if error is None:
            if username != '':
                user.username = username
            if email != '':
                user.email = email
            if new_password != '':
                user.set_password_hash(new_password)
            db.session.commit()
            print(f"User {user_id} edited succesfully")
            return jsonify({'msg': 'User edited successfully'})
        else:
            print(f"Error {error}")
            return jsonify({'msg': error})
    except Exception as e:
        errMsg = str(e)
        error = ""
        if 'users.email' in errMsg:
            error = f"E-mail {email} is already taken"
        elif 'users.username:' in errMsg:
            error = f"Username {username} is already taken"
        else:
            error = "Unknown error:\n" + errMsg
        print(f"Error {error}")
        return jsonify({'msg': error})
    else:
        print(f"User {user_id} edited succesfully")
        return jsonify({'msg': 'User edited successfully'})
