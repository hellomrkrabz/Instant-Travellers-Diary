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

bp = Blueprint("profile", __name__, url_prefix="/profile")

@bp.route("/edit", methods=("GET", "POST"))
def edit():
    pass

    db = get_db()
    user_id = session.get("user_id")
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        email = request.form["email"]
        image = request.files["image"]
        avatar = convertToBinaryData(image.filename)

        error = None
        if not username:
            error = "Username is required."
        elif not password:
            error = "Password is required."
        elif not email:
            error = "E-mail is required."

        if error is None:
            try:
                db.execute(
                    "UPDATE users SET username = ?, email = ?, image = ? WHERE id = ?;",
                    (username, email, avatar, user_id),
                )
                db.commit()
            except db.IntegrityError as regError:
                errMsg = str(regError)
                error = ""
                if errMsg.endswith("users.email"):
                   error = f"E-mail {email} is already taken"
                elif errMsg.endswith("users.username"):
                    error = f"Username {username} is already taken"
                else:
                    error = "Unknown error :P"
            else:
                return redirect(url_for("auth.login"))

        flash(error)

    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    print(user_id)
    print(user)
    return render_template("profile.html", data=user)
