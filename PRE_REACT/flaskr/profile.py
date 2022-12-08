from flask import (
    Blueprint,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for
)

# from flaskr.db import get_db
# from flaskr.auth import convertToBinaryData

from . import db
from .user import User

bp = Blueprint("profile", __name__, url_prefix="/profile")


@bp.route("/edit", methods=("GET", "POST"))
def edit():
    user_id = session.get("user_id")
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        confirm_password = request.form["confirmPassword"]
        email = request.form["email"]
        bio = request.form["bio"]
        # image = request.files["image"]
        # avatar = convertToBinaryData(image.filename)

        error = None

        if error is None:
            try:
                user = User.query.filter_by(id=user_id).first()
                if request.form.get('usernameCheckBox'):
                    if not username:
                        error = "Username is required."
                    else:
                        user.username = username
                if request.form.get('imageCheckBox'):
                    pass
                if request.form.get('bioCheckBox'):
                    user.bio = bio
                if request.form.get('emailCheckBox'):
                    if not email:
                        error = "E-mail is required."
                    else:
                        user.email = email
                if request.form.get('passwordCheckBox'):
                    if not password:
                        error = "Password is required."
                    else:
                        if password == confirm_password:
                            user.password = password
                        else:
                            error = "Passwords are not the same."

                db.session.commit()
            except Exception as e:
                errMsg = str(e)
                error = ""
                if 'users.email' in errMsg:
                    error = f"E-mail {email} is already taken"
                elif 'users.username:' in errMsg:
                    error = f"Username {username} is already taken"
                else:
                    error = "Unknown error:\n" + errMsg
            else:
                return redirect(url_for("auth.login"))

        flash(error)

    user = User.query.filter_by(id=user_id).first()
    return render_template("profile.html", data=user)
