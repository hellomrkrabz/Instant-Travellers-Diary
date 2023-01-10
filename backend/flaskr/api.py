from flask import Blueprint, jsonify, request
from .journey import Journey
from .stage import Stage
from .user import User
from . import db

from .image import Image

# TODO: make this function do stuff
def body_to_html(body: str) -> str:
    return body


bp = Blueprint("api", __name__, url_prefix='/api')


@bp.route('/users/<u_id>', methods=['GET'])
def get_user_data(u_id):
    user = User.query.filter_by(id=u_id).first()
    if user is None:
        return jsonify({'msg': 'Specified user does not exist'})

    return jsonify({
        'username': user.get_username(),
        'email': user.get_email(),
        'avatar': user.get_avatar()
    })


@bp.route('/Journeys/<user_id>', methods=['GET'])
def get_user_journeys(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({'msg': 'Specified user does not exist'})
    journeys = Journey.query.filter_by(
        author_id=user.get_id()
    ).all()
    journeys_json = [{'id': j.get_id(),
                      'name': j.get_name(),
                      'body': j.get_body()} for j in journeys]

    return jsonify({'journeys': journeys_json})


@bp.route('/Stages/<journey_id>', methods=['GET'])
def get_journey_stages(journey_id):
    journey = Journey.query.filter_by(id=journey_id).first()
    if journey is None:
        return jsonify({'msg': 'Specified journey does not exist'})
    stages = Stage.query.filter_by(
        journey_id=journey.get_id()
    ).all()
    stages_json = [{'id': s.get_id(),
                    'name': s.get_name(),
                    'body': s.get_body()} for s in stages]

    return jsonify({'stages': stages_json})


@bp.route('/<entity_type>/add', methods=['POST'])
def add(entity_type):

    data = request.get_json()
    print(data)
    

    entity_type = str(entity_type)
    entity = None
    try:
        if entity_type == 'journey':
            name = data['name']
            description = data['description']
            initialDate = data['initialDate']
            endDate = data['endDate']
            picture = data['picture']
            stages = data['stages']
            print("tu jeszcze działa")
            
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

# @bp.route('/<user_id>/avatar', methods=['GET'])
# def get_avatar(user_id):
#     avatar = Avatar.query.filter_by(
#         user_id=user_id,
#     ).first()
#
#     if avatar is None:
#         return jsonify({'msg': 'Avatar for this user does not exist'})
#
#     return jsonify({'msg': avatar.get_full_filename()})

@bp.route('/Journey/<journey_id>/images', methods=['GET'])
def get_image_names(journey_id):

    images = Image.query.filter_by(
        journey_id=journey_id
    ).all()

    if images is None:
        return jsonify({'msg': 'Specified image does not exist'})

    images_json = [{'u_id': i.get_user_id(),
                    'j_id': i.get_journey_id(),
                    's_id': i.get_stage_id(),
                    'e_id': i.get_event_id(),
                    'filename': i.get_full_filename} for i in images]

    return jsonify({'images': images_json})


@bp.route('/get_image_names', methods=['GET'])
def get_image_names_old():
    data = request.get_json()
    u_id = data['userID']
    j_id = data['journeyID']
    s_id = data['stageID']
    e_id = data['eventID']

    images = Image.query.filter_by(
        user_id=u_id,
        journey_id=j_id,
        stage_id=s_id,
        event_id=e_id
    ).all()

    if images is None:
        return jsonify({'msg': 'Specified image does not exist'})

    images_json = [{'u_id': i.get_user_id(),
                    'j_id': i.get_journey_id(),
                    's_id': i.get_stage_id(),
                    'e_id': i.get_event_id(),
                    'filename': i.get_full_filename} for i in images]

    return jsonify({'images': images_json})
