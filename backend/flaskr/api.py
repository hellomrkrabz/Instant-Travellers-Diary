from flask import Blueprint, jsonify, request
from .journey import Journey
from .stage import Stage
from .user import User
from . import db


# TODO: make this function do stuff
def body_to_html(body: str) -> str:
    return body


bp = Blueprint("api", __name__, url_prefix='/api')


@bp.route('/users/<id>', methods=['GET'])
def get_user_data(id):
    user = User.query.filter_by(id=id).first()
    if user is None:
        return jsonify({'msg': 'Specified user does not exist'})
    return jsonify({
        'username': user.get_username(),
        'email': user.get_email()
    })


@bp.route('/<username>/journeys', methods=['GET'])
def get_user_journeys(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({'msg': 'Specified user does not exist'})
    journeys = Journey.query.filter_by(
        author_id=user.get_id()
    ).all()
    journeys_json = [{'id': j.get_id(),
                      'name': j.get_name(),
                      'body': j.get_body(),
                      'author_id': j.get_author_id()} for j in journeys]
    return jsonify({'journeys': journeys_json})


@bp.route('/<journey_id>/stages', methods=['GET'])
def get_journey_stages(journey_id):
    journey = Journey.query.filter_by(id=journey_id).first()
    if journey is None:
        return jsonify({'msg': 'Specified journey does not exist'})
    stages = Stage.query.filter_by(
        journey_id=journey.get_id()
    ).all()
    stages_json = [{'id': s.get_id(),
                    'name': s.get_name(),
                    'body': s.get_body(),
                    'journey_id': s.get_journey_id()} for s in stages]

    return jsonify({'stages': stages_json})


@bp.route('/<entity_type>/add', methods=['POST'])
def add(entity_type):
    data = request.get_json()
    name = data['name']
    body = data['body']
    relationship_id = data['relationship_id']

    entity_type = str(entity_type)
    entity = None
    try:
        if entity_type == 'journey':
            entity = Journey(name=name,
                             body=body,
                             body_html=body_to_html(body),
                             author_id=relationship_id)
        elif entity_type == 'stage':
            # Check if stage's journey exists
            exists = db.session.query(
                db.session.query(Journey).filter_by(
                    id=relationship_id
                ).exists()
            ).scalar()

            if not exists:
                error = f"Couldn't find a Journey with id {relationship_id}"
                print('[ERROR] ::', error)
                return jsonify({'msg': error})

            entity = Stage(name=name,
                           body=body,
                           body_html=body_to_html(body),
                           journey_id=relationship_id)
        else:
            print(f"[ERROR] :: Unknown entity type: {entity_type}")
            return jsonify({'msg': f"Unknown entity type: {entity_type}"})

        db.session.add(entity)
        db.session.commit()
        print(f"[INFO] {entity} created successfully")
        return jsonify({"msg": "success"})
    except Exception as e:
        error = str(e)
        print('[ERROR] ::', error)
        return jsonify({'msg': error})

# @bp.route('/journey/add', methods=['POST'])
# def add():
#     data = request.get_json()
#     name = data['name']
#     body = data['body']
#     author_id = data['author_id']
#
#     try:
#         journey = Journey(name=name,
#                           body=body,
#                           body_html=body_to_html(body),
#                           author_id=author_id)
#         db.session.add(journey)
#         db.session.commit()
#         print(f"[INFO] {journey}:{name} created successfully")
#         return jsonify({"msg": "success"})
#     except Exception as e:
#         error = str(e)
#         print('[ERROR] ::', error)
#         return jsonify({'msg': error})
