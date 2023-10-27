from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_socketio import SocketIO
from flask import send_from_directory
from flask import Response
import os

load_dotenv()

app = Flask(__name__, static_folder='../Client/dist')
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)
db = SQLAlchemy(app)
static_folder_path = '../Client'
 
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(120), nullable=False)

@socketio.on('send_message')
def handle_message(data):
    new_message = Message(user_id=data['user_id'], message=data['message'])
    db.session.add(new_message)
    db.session.commit()

    user = User.query.get(data['user_id'])
    if user: 
        username = user.username
    else:
        return
    
    socketio.emit('receive_message', {
        'id': new_message.id, 
        'username': username, 
        'message': new_message.message,
        'clientId': data.get('clientId')
    }, skip_sid=request.sid)

@app .route('/health', methods=['GET'])
def health_check():
    return "app is running!", 200

@app.errorhandler(Exception)
def handle_error(e):
    return str(e), 500


@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        new_user_data = request.get_json()
        username = new_user_data['username']
        password = new_user_data['password']

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'msg': 'These credentials already exist'}), 400
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'id': new_user.id, 'username': new_user.username}), 201

    except Exception as e:
        print(e)  
        return jsonify({'msg': 'Error creating user'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={'username': username})
        return jsonify(access_token=access_token, user_id=user.id), 200
    
    return jsonify({"msg": "Please use valid username and password"}), 401

@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        messages = db.session.query(
            Message.id, Message.message, User.username
        ).join(
            User, User.id == Message.user_id
        ).all()
        return jsonify([{'id': msg.id, 'message': msg.message, 'username': msg.username} for msg in messages]), 200
    except Exception as e:
        print(e)
        print("Error occured while trying to get messages")
        return jsonify({'msg': 'Internal Server Error'}), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        new_message_data = request.get_json()
        print(f"Received data: {new_message_data}")
        new_message = Message(user_id=new_message_data['user_id'], message=new_message_data['message'])
        db.session.add(new_message)
        db.session.commit()

        user = User.query.get(new_message.user_id)
        if user is None:
            print("Error: User not found")
            return jsonify({'msg': 'Internal Server Error'}), 500

        return jsonify({'id': new_message.id, 'username': user.username,'message': new_message.message}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'msg': 'Internal Server Error'}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([{'id': user.id, 'username': user.username} for user in users]), 200
    except Exception as e:
        print(e)
        print("Error occurred while trying to get users")
        return jsonify({'msg': 'Internal Server Error'}), 500


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path and (path.startswith("assets") or path.endswith(".svg") or path.endswith(".js") or path.endswith(".css")):
        return send_from_directory(app.static_folder, path)
    else:
        print(f"Serving React app for path: {path}")
        return app.send_static_file('index.html')



if __name__ == '__main__':
    socketio.run(app, debug=True)
