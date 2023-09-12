from flask import Flask, request, jsonify

app = Flask(__name__)

app.route('/')
def hello():
  return "Hello, World!"

dummy_data = {
  "users": [
    {"id": 1, "username": "user1", "password": "pass1"},
    {"id": 1, "username": "user2", "password": "pass2"}
  ],
  "messages": [
    {"id": 1, "user_id": 1, "message": "Hello World!"},
    {"id": 2, "user_id": 2, "message": "Hi there!"}
  ]
}

if __name__ == '__main__':
  app.run(debug=True)