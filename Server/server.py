from flask import Flask, request, jsonify

app = Flask(__name__)

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

if __name__ == '__main__':
  app.run(debug=True)
