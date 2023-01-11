from flask import Blueprint, jsonify, request
from .journey import Journey
from .stage import Stage
from .user import User
from . import db
from datetime import datetime


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
                      'author_id': j.get_author_id(),
                      'initial_date': j.get_initial_date(),
                      'end_date': j.get_end_date(),
                      'description': j.get_description()} for j in journeys]

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
                    'body': s.get_description()} for s in stages]

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
            initial_date = data['initialDate']
            end_date = data['endDate']
            relationship_id = data['userId']

            initial_date = datetime.strptime(initial_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

            entity = Journey(name=name,
                             description=description,
                             initial_date=initial_date,
                             end_date=end_date,
                             author_id=relationship_id)

        elif entity_type == 'stage':
            # Check if stage's journey exists
            name = data['name']
            description = data['description']
            timestamp = data['timestamp']
            relationship_id = data['userId']

            timestamp = datetime.strptime(timestamp, '%Y-%m-%d')
            
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
                           description=description,
                           timestamp=timestamp,
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


#               v- journey / stage / event
@bp.route('/<relationship_type>/<relatioship_id>/images', methods=['GET'])
def get_image_names(relationship_type, relationship_id):
    images = Image.query.filter_by(
        type=relationship_type.lower(),
        relationship_id=relationship_id
    ).all()

    if images is None:
        return jsonify({'msg': 'Specified image does not exist'})

    images_json = [{'id': i.get_id(),
                    'filename': i.get_filename()} for i in images]

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
