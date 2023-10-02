from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager



load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'sadkjhf23eliua79782gfghlf'
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


@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        messages = Message.query.all()
        return jsonify([{'id': msg.id, 'user_id': msg.user_id, 'message': msg.message} for msg in messages]), 200
    except Exception as e:
        return jsonify(str(e)), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        new_message_data = request.get_json()
        new_message = Message(user_id=new_message_data['user_id'], message=new_message_data['message'])
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'id': new_message.id, 'user_id': new_message.user_id, 'message': new_message.message}), 201
    except Exception as e:
        return jsonify(str(e)), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([{'id': user.id, 'username': user.username, 'password': user.password} for user in users]), 200
    except Exception as e:
        return jsonify(str(e)), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        new_user_data = request.get_json()
        new_user = User(username=new_user_data['username'], password=new_user_data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'id': new_user.id, 'username': new_user.username, 'password': new_user.password}), 201
    except Exception as e:
        return jsonify(str(e)), 500
  
if __name__ == '__main__':
  app.run(debug=True)
