from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import os

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(120), nullable=False)

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        new_user_data = request.get_json()
        username = new_user_data['username']
        password = new_user_data['password']

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'msg': 'Username already exists'}), 400
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'id': new_user.id, 'username': new_user.username}), 201
    except Exception as e:
        print(e)  
        return jsonify({'msg': 'Error creating user'}), 500

@app.route('/login', methods=['POST'])
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
        return jsonify(access_token=access_token), 200
    
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        messages = Message.query.all()
        return jsonify([{'id': msg.id, 'user_id': msg.user_id, 'message': msg.message} for msg in messages]), 200
    except Exception as e:
        print(e)
        return jsonify({'msg': 'Internal Server Error'}), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        new_message_data = request.get_json()
        new_message = Message(user_id=new_message_data['user_id'], message=new_message_data['message'])
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'id': new_message.id, 'user_id': new_message.user_id, 'message': new_message.message}), 201
    except Exception as e:
        print(e)
        return jsonify({'msg': 'Internal Server Error'}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([{'id': user.id, 'username': user.username} for user in users]), 200
    except Exception as e:
        print(e)
        return jsonify({'msg': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
