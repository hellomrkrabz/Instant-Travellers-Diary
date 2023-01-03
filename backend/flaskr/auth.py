from .user import User
from . import db
from flask import (
    Blueprint,
    g,
    redirect,
    request,
    make_response,
    session,
    url_for,
    jsonify
)
from werkzeug.security import generate_password_hash
import re
import json

bp = Blueprint('auth', __name__)

regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')

@bp.route('/Register', methods=['POST'])
def Register():
    data = request.get_json()

    username = data['username']
    password = data['password']
    email = data['email']

    error = None

    if username == '' or not username:
        error = 'Username is required.'
    elif password == '' or not password:
        error = 'Password is required.'
    elif email == '' or not re.fullmatch(regex, email):
        error = 'E-mail is required.'
    if error is not None:
        print('error:', error)
        return jsonify({"msg": error})

    try:
        user = User(username=username,
                    email=email,
                    password_hash=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()
        print(f"[INFO] User {username} created successfully")
        return jsonify({"msg": "success"})
    except Exception as e:
        error = str(e)
        if 'users.email' in error:
            error = f"E-mail {email} is already taken"
        elif 'users.username:' in error:
            error = f"Username {username} is already taken"
        else:
            print('[ERROR] ::', error)
            return jsonify({"msg": error})


@bp.route('/Login', methods=['POST'])
def Login():
    data = request.get_json()

    username = data['username']
    password = data['password']

    print(f"Logging in user {username}...")

    error = None

    user = User.query.filter_by(username=username).first()
    if user is None:
        error = 'Incorrect username.'
    elif not user.verify_password(password):
        error = 'Incorrect password.'

    if error is None:
        session.clear()
        session['user_id'] = user.get_id()
        print(f"user id: {user.get_id()}")

        resp = jsonify({'user_id': user.get_id(), 'msg': 'success'})

        response = make_response(resp)
        response.headers['Access-Control-Allow-Credentials'] = True
        response.set_cookie(b'user_id',
                            value=json.dumps(user.get_id()),
                            domain='127.0.0.1:3000')
        return response, 200

    print(f"error: {error}")
    return jsonify({"msg": error})


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = User.query.filter_by(id=user_id).first()


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))


# def login_required(view):
#     @functools.wraps(view)
#     def wrapped_view(**kwargs):
#         if g.user is None:
#             return redirect(url_for('auth.login'))
# 
#         return view(**kwargs)
# 
#     return wrapped_view
