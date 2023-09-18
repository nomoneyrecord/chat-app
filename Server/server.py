from flask import Flask, request, jsonify
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/chat_app_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(120), nullable=False)

@app.route('/')
def hello():
  return "Hello, World!"

dummy_data = {
  "users": [
    {"id": 1, "username": "user1", "password": "pass1"},
    {"id": 2, "username": "user2", "password": "pass2"}  
  ],
  "messages": [
    {"id": 1, "user_id": 1, "message": "Hello World!"},
    {"id": 2, "user_id": 2, "message": "Hi there!"}
  ]
}

@app.route('/api/messages', methods=['GET'])
def get_messages():
  return jsonify(dummy_data['messages'])

@app.route('/api/messages', methods=['POST'])
def create_message():
  new_message = request.get_json()
  new_id = len(dummy_data['messages']) + 1
  new_message['id'] = new_id
  dummy_data['messages'].append(new_message)
  return jsonify(new_message), 201

@app.route('/api/users', methods=['GET'])
def get_users():
  return jsonify(dummy_data['users'])

@app.route('/api/users', methods=['POST'])
def create_user():
  new_user = request.get_json()
  new_id = len(dummy_data['users']) + 1
  new_user['id'] = new_id
  dummy_data['users'].append(new_user)
  return jsonify(new_user), 201
  
if __name__ == '__main__':
  app.run(debug=True)
