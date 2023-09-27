import unittest
import json
from server import app, db, User, Message

class ServerTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        db.create_all() 

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_login(self):
        user = User(username="testuser", password="testpass")
        db.session.add(user)
        db.session.commit()

        response = self.app.post('/api/users', data=json.dumps(dict(
            username="testuser",
            password="testpass"
        )), content_type='application/json', follow_redirects=True)

        self.assertEqual(response.status_code, 201)

    def test_create_message(self):
        user = User(username="testuser", password="testpass")
        db.session.add(user)
        db.session.commit()

        response = self.app.post('/api/messages', data=json.dumps(dict( 
          user_id=user.id,
          message="Hello, world!"
        )), content_type='application/json', follow_redirects=True) 

        self.assertEqual(response.status_code, 201)
        self.assertIn(b"Hello, world!", response.data)

if __name__ == '__main__': 
    unittest.main()
