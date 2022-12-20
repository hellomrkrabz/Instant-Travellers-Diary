import functools
from .user import User
from . import db
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint('auth', __name__)


@bp.route('/Register', methods=['POST'])
def Register():
    data = request.get_json()

    username = data['username']
    password = data['password']
    email = data['email']

    error = None

    if not username:
        error = 'Username is required.'
    elif not password:
        error = 'Password is required.'
    elif not email:
        error = 'E-mail is required.'

    if error is None:
        try:
            user = User(username=username,
                        email=email,
                        password_hash=generate_password_hash(password))
            db.session.add(user)
            db.session.commit()
            print('[INFO] User created successfully')
            print('> User details:')
            print('  > email:   ', email)
            print('  > username:', username)
            print('  > password:', password)
            return jsonify({"msg": "register successful"})
        except Exception as e:
            errMsg = str(e)
            error = ""
            if 'users.email' in errMsg:
                error = f"E-mail {email} is already taken"
            elif 'users.username:' in errMsg:
                error = f"Username {username} is already taken"
            else:
                error = "Unknown error :P\n" + errMsg
                print('error:', error)
        else:
            return jsonify({"msg": "register failed"})
            # return redirect(url_for("/Login"))

    print('error:', error)
    flash(error)
    return jsonify({"msg": "register failed"})


@bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None
        user = User.query.filter_by(username=username).first()
        if user is None:
            error = 'Incorrect username.'
        elif not user.verify_password(password):
            error = 'Incorrect password.'

        if error is None:
            session.clear()
            session['user_id'] = user.get_id()
            return redirect(url_for('index'))

        flash(error)


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
