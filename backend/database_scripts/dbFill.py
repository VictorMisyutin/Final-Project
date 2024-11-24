import requests

# The URL of the login route (assuming it's running locally on port 3000)
url = 'http://localhost:4000/api/users/login'

# The login credentials to test
credentials = {
    'email': 'john@example.com',
    'password': 'password123'
}

# Sending POST request to the login endpoint
response = requests.post(url, json=credentials)

# Check the response status code and print the result
if response.status_code == 200:
    print("Login successful")
    print("Token:", response.json().get('data').get('token'))
    print("User Info:", response.json().get('data').get('user'))
else:
    print("Login failed")
    print("Error message:", response.json().get('message'))
