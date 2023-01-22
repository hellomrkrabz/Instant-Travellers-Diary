from flask import Blueprint, jsonify, request
from .journey import Journey
from .stage import Stage
from .event import Event
from .user import User
from . import db
from datetime import datetime


from .image import Image


bp = Blueprint("api", __name__, url_prefix='/api')


@bp.route('/users/<u_id>', methods=['GET'])
def get_user_data(u_id):
    user = User.query.filter_by(id=u_id).first()
    if user is None:
        return jsonify({'msg': 'Specified user does not exist'})

    journeys = Journey.query.filter_by(author_id=user.get_id()).all()

    return jsonify({
        'username': user.get_username(),
        'email': user.get_email(),
        'avatar': user.get_avatar(),
        'bio': user.get_bio(),
        'journeys': [j.get_id() for j in journeys]
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
                      'image_path': 'najn',
                      'description': j.get_description()} for j in journeys]

    return jsonify({'journeys': journeys_json})


@bp.route('/EventIds/<user_id>', methods=['GET'])
def get_user_all_event_ids(user_id):
    stages = []
    events = []
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({'msg': 'Specified user does not exist'})
    journeys = Journey.query.filter_by(
        author_id=user.get_id()
    ).all()
    for journey in journeys:
        stages += Stage.query.filter_by(
            journey_id=journey.get_id()
        ).all()
    for stage in stages:
        events += Event.query.filter_by(
            stage_id=stage.get_id()
        ).all()
    ids_json = [{'id': e.get_id(),
                 'lat': e.get_lat(),
                 'lng': e.get_lng()} for e in events]

    return jsonify({'ids': ids_json})


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
                    'timestamp': s.get_timestamp(),
                    'description': s.get_description(),
                    'events': get_stage_events(s.get_id()).get_json()['events']} for s in stages]

    return jsonify({'stages': stages_json})


@bp.route('/Events/<journey_id>/<stage_id>', methods=['GET'])
def get_stage_events_old(journey_id, stage_id):
    journey = Journey.query.filter_by(id=journey_id).first()
    if journey is None:
        return jsonify({'msg': 'Specified journey does not exist'})
    stage = Stage.query.filter_by(id=stage_id).first()
    if stage is None:
        return jsonify({'msg': 'Specified stage does not exist'})
    events = Event.query.filter_by(
        stage_id=stage.get_id(),
        journey_id=journey.get_id()
    ).all()
    events_json = [{'id': e.get_id(),
                    'name': e.get_name(),
                    'timestamp': e.get_timestamp(),
                    'lat': e.get_lat(),
                    'lng': e.get_lng(),
                    'description': e.get_description()} for e in events]

    return jsonify({'events': events_json})


@bp.route('/Events/<stage_id>', methods=['GET'])
def get_stage_events(stage_id):
    stage = Stage.query.filter_by(id=stage_id).first()
    if stage is None:
        return jsonify({'msg': 'Specified stage does not exist'})
    events = Event.query.filter_by(
        stage_id=stage.get_id()
    ).all()
    events_json = [{'id': e.get_id(),
                    'name': e.get_name(),
                    'timestamp': e.get_timestamp(),
                    'lat': e.get_lat(),
                    'lng': e.get_lng(),
                    'description': e.get_description()} for e in events]

    return jsonify({'events': events_json})


@bp.route('/<entity_type>/<action>', methods=['POST'])
def add_or_edit_entity(entity_type, action):
    data = request.get_json()
    entity_type = str(entity_type)
    entity = None

    try:
        if entity_type == 'journey':
            name = data['name']
            description = data['description']
            initial_date = data['initial_date']
            end_date = data['end_date']
            relationship_id = data['userId']

            initial_date = datetime.strptime(initial_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

            if initial_date > end_date:
                print(
                    "[INFO]",
                    "Swapping order of dates:\n"
                )
                initial_date, end_date = end_date, initial_date
                print(
                    "[INFO]",
                    f"New order: {initial_date} -> {end_date}"
                )
            else:
                print("[INFO] Date order is correct")

            if action == "add":
                entity = Journey(name=name,
                                 description=description,
                                 initial_date=initial_date,
                                 end_date=end_date,
                                 author_id=relationship_id)
            elif action == "edit":
                entity = Journey.query.filter_by(id=data['id']).first()
                entity.name = name
                entity.description = description
                entity.initial_date = initial_date
                entity.end_date = end_date
            else:
                print(f"[ERROR] :: Unknown action: {action}")
                return jsonify({'msg': f"Unknown action: {action}"})

        elif entity_type == 'stage':
            name = data['name']
            description = data['description']
            timestamp = data['timestamp']
            relationship_id = data['userId']

            timestamp = datetime.strptime(timestamp, '%Y-%m-%d')

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

            journey = Journey.query.filter_by(id=relationship_id).first()
            print(
                "[INFO]",
                f"Timestamp before: {timestamp}"
            )
            if timestamp.datetime() < journey.get_initial_date_datetime():
                timestamp = journey.get_initial_date_datetime()
            elif timestamp.datetime() > journey.get_end_date_datetime():
                timestamp = journey.get_end_date_datetime()
            print(
                "[INFO]",
                f"Timestamp after:  {timestamp}"
            )

            if action == "add":
                entity = Stage(name=name,
                               description=description,
                               timestamp=timestamp,
                               journey_id=relationship_id)
            elif action == "edit":
                entity = Stage.query.filter_by(id=data['id']).first()
                entity.name = name
                entity.description = description
                entity.timestamp = timestamp
            else:
                print(f"[ERROR] :: Unknown action: {action}")
                return jsonify({'msg': f"Unknown action: {action}"})

        elif entity_type == 'event':
            name = data['name']
            description = data['description']
            timestamp = data['timestamp']
            relationship_id = data['userId']
            journey_id = data['journeyId']

            lat = float(data['lat'])
            lng = float(data['lng'])

            timestamp = datetime.strptime(timestamp, '%Y-%m-%d')

            # Check if event's stage exists
            exists = db.session.query(
                db.session.query(Stage).filter_by(
                    id=relationship_id
                ).exists()
            ).scalar()
            if not exists:
                error = f"Couldn't find a Stage with id {relationship_id}"
                print('[ERROR] ::', error)
                return jsonify({'msg': error})

            stage = Stage.query.filter_by(id=relationship_id).first()
            print(
                "[INFO]",
                f"Timestamp before: {timestamp}"
            )
            if timestamp.datetime() != stage.get_timestamp_datetime():
                timestamp = stage.get_timestamp_datetime()
            print(
                "[INFO]",
                f"Timestamp before: {timestamp}"
            )

            if action == "add":
                entity = Event(name=name,
                               description=description,
                               timestamp=timestamp,
                               journey_id=journey_id,
                               stage_id=relationship_id,
                               latitude=lat,
                               longitude=lng)
            elif action == "edit":
                entity = Stage.query.filter_by(id=data['id']).first()
                entity.name = name
                entity.description = description
                entity.timestamp = timestamp
                entity.latitude = lat
                entity.longitude = lng
            else:
                print(f"[ERROR] :: Unknown action: {action}")
                return jsonify({'msg': f"Unknown action: {action}"})

        else:
            print(f"[ERROR] :: Unknown entity type: {entity_type}")
            return jsonify({'msg': f"Unknown entity type: {entity_type}"})

        if action == "add":
            db.session.add(entity)
        db.session.commit()
        print(f"[INFO] Action '{action}' on {entity} performed successfully")
        return jsonify({"msg": "success", "id": entity.get_id()})
    except Exception as e:
        error = str(e)
        print('[ERROR] :: Failed to add/edit post. Cause:', error)
        return jsonify({'msg': error})


@bp.route('/image/delete', methods=['POST'])
def delete_image():
    data = request.get_json()
    image_id = data['id']
    image = Image.query.filter_by(id=image_id).first()
    db.session.delete(image)
    db.session.commit()


def delete_orphan_images():
    all_images = Image.query.all()
    for image in all_images:
        if image.type == 'journey':
            exists = db.session.query(
                db.session.query(Journey).filter_by(
                    id=image.relationship_id
                ).exists()
            ).scalar()
            if not exists:
                print(f"[INFO] Deleting image: {image.filename}")
                db.session.delete(image)

        elif image.type == 'stage':
            exists = db.session.query(
                db.session.query(Stage).filter_by(
                    id=image.relationship_id
                ).exists()
            ).scalar()
            if not exists:
                print(f"[INFO] Deleting image: {image.filename}")
                db.session.delete(image)

        elif image.type == 'event':
            exists = db.session.query(
                db.session.query(Event).filter_by(
                    id=image.relationship_id
                ).exists()
            ).scalar()
            if not exists:
                print(f"[INFO] Deleting image: {image.filename}")
                db.session.delete(image)

        db.session.commit()


@bp.route('/<entity_type>/delete', methods=['POST'])
def delete(entity_type):
    data = request.get_json()
    id = data['id']
    entity_type = str(entity_type).lower()
    entity = None

    try:
        if entity_type == 'journey':
            entity = Journey.query.filter_by(id=id).first()
        elif entity_type == 'stage':
            entity = Stage.query.filter_by(id=id).first()
        elif entity_type == 'event':
            entity = Event.query.filter_by(id=id).first()
        else:
            print(f"[ERROR] :: Unknown entity type: {entity_type}")
            return jsonify({'msg': f"Unknown entity type: {entity_type}"})

        db.session.delete(entity)
        db.session.commit()
        print(f"[INFO] {entity} deleted successfully")
        delete_orphan_images()
        return jsonify({"msg": "success"})
    except Exception as e:
        error = str(e)
        print('[ERROR] ::', error)
        return jsonify({'msg': error})


#               v- journey / stage / event
@bp.route('/<relationship_type>/<relationship_id>/images', methods=['GET'])
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
