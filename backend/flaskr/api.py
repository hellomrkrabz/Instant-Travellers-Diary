from flask import Blueprint, jsonify, request
from .journey import Journey
from .stage import Stage
from .event import Event
from .user import User
from .visited_site import VisitedSite
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


@bp.route('/journey/<j_id>/sites', methods=['GET'])
def get_journey_site_info(j_id):
    sites = []
    j_events = Event.query.filter_by(journey_id=j_id).all()
    for event in j_events:
        sites += VisitedSite.query.filter_by(event_id=event.get_id()).all()

    sites_json = [{
        'id': s.get_id(),
        'description': s.get_description(),
        'event_id': s.get_event_id(),
        'public': s.is_public(),
        'image': Image.query.filter_by(
            relationship_id=s.get_id(),
            type="site"
        ).first().get_filename()
    } for s in sites]

    return jsonify({'sites': sites_json})


@bp.route('/journey_info/<j_id>', methods=['GET'])
def get_journey_info(j_id):
    journey = Journey.query.filter_by(id=j_id).first()
    if journey is not None:
        return jsonify({
            'author_id': journey.get_author_id(),
            'public': journey.is_public()
        })
    return jsonify({'msg': 'Specified journey does not exist'})


@bp.route('/Journeys/<user_id>', methods=['GET'])
def get_user_journeys(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({'msg': 'Specified user does not exist'})
    journeys = Journey.query.filter_by(
        author_id=user.get_id()
    ).all()
    journeys_json = [{
        'id': j.get_id(),
        'name': j.get_name(),
        'author_id': j.get_author_id(),
        'initial_date': j.get_initial_date(),
        'end_date': j.get_end_date(),
        'image_path': 'najn',
        'public': j.is_public(),
        'price': get_journey_cost(j.get_id()).get_json()['cost'],
        'description': j.get_description()
    } for j in journeys]

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
    ids_json = [{
        'id': e.get_id(),
        'lat': e.get_lat(),
        'lng': e.get_lng()
    } for e in events]

    return jsonify({'ids': ids_json})


@bp.route('/Stages/<journey_id>', methods=['GET'])
def get_journey_stages(journey_id):
    journey = Journey.query.filter_by(id=journey_id).first()
    if journey is None:
        return jsonify({'msg': 'Specified journey does not exist'})
    stages = Stage.query.filter_by(
        journey_id=journey.get_id()
    ).all()
    stages_json = [{
        'id': s.get_id(),
        'name': s.get_name(),
        'timestamp': s.get_timestamp(),
        'description': s.get_description(),
        'public': s.is_public(),
        'price': get_stage_cost(
            s.get_id()
        ).get_json()['cost'],
        'events': get_stage_events(
            s.get_id()
        ).get_json()['events']
    } for s in stages]

    stages_json = sorted(
        stages_json, key=lambda s: s['timestamp']
    )
    return jsonify({'stages': stages_json})


@bp.route('/Events/<stage_id>', methods=['GET'])
def get_stage_events(stage_id):
    stage = Stage.query.filter_by(id=stage_id).first()
    if stage is None:
        return jsonify({'msg': 'Specified stage does not exist'})
    events = Event.query.filter_by(
        stage_id=stage.get_id()
    ).all()

    events_json = [{
        'id': e.get_id(),
        'name': e.get_name(),
        'timestamp': e.get_timestamp(),
        'lat': e.get_lat(),
        'lng': e.get_lng(),
        'public': e.is_public(),
        'description': e.get_description(),
        'sites': get_event_sites(e.get_id()).get_json()['sites'],
        'price': get_event_cost(e.get_id()).get_json()['cost']
    } for e in events]

    return jsonify({'events': events_json})


@bp.route('/Event/<event_id>/cost', methods=['GET'])
def get_event_cost(event_id):
    event = Event.query.filter_by(id=event_id).first()
    if event is not None:
        return jsonify({
            'cost': float(event.get_cost())
        })
    else:
        return jsonify({
            'cost': 0.0
        })


@bp.route('/Stage/<stage_id>/cost', methods=['GET'])
def get_stage_cost(stage_id):
    cost = 0.0

    events = Event.query.filter_by(stage_id=stage_id).all()
    for event in events:
        cost += float(
            get_event_cost(event.get_id()).get_json()['cost']
        )

    return jsonify({
        'cost': cost
    })


@bp.route('/Journey/<journey_id>/cost', methods=['GET'])
def get_journey_cost(journey_id):
    cost = 0.0

    stages = Stage.query.filter_by(journey_id=journey_id).all()
    for stage in stages:
        cost += float(
            get_stage_cost(stage.get_id()).get_json()['cost']
        )

    return jsonify({
        'cost': cost
    })


@bp.route('/Sites/<site_id>', methods=['GET'])
def get_event_sites(site_id):
    event = Event.query.filter_by(id=site_id).first()
    if event is None:
        return jsonify({'msg': 'Specified event does not exist'})
    sites = VisitedSite.query.filter_by(
        event_id=event.get_id()
    ).all()
    sites_json = [{
        'id': s.get_id(),
        'description': s.get_description(),
        'public': s.is_public(),
    } for s in sites]

    return jsonify({'sites': sites_json})


@bp.route('/Event/<event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.filter_by(id=event_id).first()
    if event is None:
        return jsonify({'msg': 'Specified event does not exist'})
    event_json = {
        'id': event.get_id(),
        'name': event.get_name(),
        'timestamp': event.get_timestamp(),
        'lat': event.get_lat(),
        'lng': event.get_lng(),
        'public': event.is_public(),
        'description': event.get_description(),
        'sites': get_event_sites(event.get_id()).get_json()['sites'],
        'cost': event.get_cost()
    }

    return event_json


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
            is_public = data['public']
            initial_date = datetime.strptime(initial_date, '%Y-%m-%d')
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

            if initial_date > end_date:
                initial_date, end_date = end_date, initial_date

            if action == "add":
                entity = Journey(
                    name=name,
                    description=description,
                    initial_date=initial_date,
                    end_date=end_date,
                    author_id=relationship_id,
                    public=is_public
                )
            elif action == "edit":
                entity = Journey.query.filter_by(id=data['id']).first()
                entity.name = name
                entity.description = description
                entity.initial_date = initial_date
                entity.end_date = end_date
                public_changed = (entity.public == is_public)
                entity.public = is_public
                if public_changed:
                    for s in Stage.query.filter_by(
                        journey_id=entity.get_id()
                    ):
                        s.public = is_public
                        for e in Event.query.filter_by(
                            stage_id=s.get_id()
                        ):
                            e.public = is_public
                            for vs in VisitedSite.query.filter_by(
                                event_id=e.get_id()
                            ):
                                vs.public = is_public

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
            if timestamp.date() < journey.get_initial_date_datetime():
                timestamp = journey.get_initial_date_datetime()
            elif timestamp.date() > journey.get_end_date_datetime():
                timestamp = journey.get_end_date_datetime()

            if action == "add":
                entity = Stage(
                    name=name,
                    description=description,
                    timestamp=timestamp,
                    journey_id=relationship_id
                )
            elif action == "edit":
                entity = Stage.query.filter_by(id=data['id']).first()
                entity.name = name
                entity.description = description
                entity.timestamp = timestamp

        elif entity_type == 'event':
            name = data['name']
            description = data['description']
            timestamp = data['timestamp']
            relationship_id = data['userId']    # it's stage ID actually :P
            journey_id = data['journeyId']      # this can be ignored

            lat = float(data['lat'])
            lng = float(data['lng'])

            cost = float(data['price'])

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
            if timestamp.date() != stage.get_timestamp_datetime():
                timestamp = stage.get_timestamp_datetime()

            if action == "add":
                entity = Event(
                    name=name,
                    description=description,
                    timestamp=timestamp,
                    journey_id=journey_id,
                    stage_id=relationship_id,
                    latitude=lat,
                    longitude=lng,
                    cost=cost
                )
            elif action == "edit":
                entity = Event.query.filter_by(id=data['id']).first()
                entity.name = name
                entity.description = description
                entity.timestamp = timestamp
                entity.latitude = lat
                entity.longitude = lng
                entity.cost = cost

        elif entity_type == 'site':
            description = data['description']
            relationship_id = data['eventId']

            # Check if site's event exists
            exists = db.session.query(
                db.session.query(Event).filter_by(
                    id=relationship_id
                ).exists()
            ).scalar()
            if not exists:
                error = f"Couldn't find an Event with id {relationship_id}"
                print('[ERROR] ::', error)
                return jsonify({'msg': error})

            if action == "add":
                entity = VisitedSite(
                    description=description,
                    event_id=relationship_id,
                )
            elif action == "edit":
                entity = VisitedSite.query.filter_by(id=data['id']).first()
                entity.description = description

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
        elif entity_type == 'site':
            entity = VisitedSite.query.filter_by(id=id).first()
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


@bp.route('/<relationship_type>/<relationship_id>/images', methods=['GET'])
def get_image_names(relationship_type, relationship_id):
    images = Image.query.filter_by(
        type=relationship_type.lower(),
        relationship_id=relationship_id
    ).all()

    if images is None:
        return jsonify({'msg': 'Specified image does not exist'})

    images_json = [{
        'id': i.get_id(),
        'filename': i.get_filename()
    } for i in images]

    return jsonify({'images': images_json})
