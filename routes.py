import datetime
from flask import Blueprint, current_app, request, jsonify, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from extensions import db  # Import db from the newly created extensions.py file
from model import User  # Import the User model

# Helper function to decode the JWT token and validate the user
def validate_token(request):
    auth_header = request.headers.get('Authorization', None)  # Extract the authorization header
    if not auth_header:
        return None, jsonify({"error": "Token is missing!"}), 401  # Return error if token is missing

    try:
        token = auth_header.split(" ")[1]  # Split the header and get the token (format: "Bearer <token>")
        decoded_token = decode_token(token)  # Decode the JWT token
        user = User.query.filter_by(email=decoded_token['sub']).first()  # Find the user by email
        if not user:
            return None, jsonify({"error": "User not found!"}), 404  # Return error if user not found
        return user, None  # Return the user if the token is valid
    except Exception as e:
        return None, jsonify({"error": f"Token error: {str(e)}"}), 401  # Return error if token validation fails


# Define a blueprint for routing (modularizes the app's routes)
routes_blueprint = Blueprint('routes', __name__)

# Default route to serve the index.html file (home page)
@routes_blueprint.route('/')
def index():
    return render_template('index.html')  # Render the index.html template when accessing '/'


# Route to handle account creation
@routes_blueprint.route('/create_account', methods=['POST'])
def create_account():
    data = request.json  # Extract the incoming JSON data from the request

    email = data.get('email')
    password = data.get('password')
    description = data.get('description')

    # Check if any required fields are missing
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400  # Return error if any fields are missing

    # Check if a user with the provided email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User with that email already exists"}), 400  # Return error if the email is already registered

    # Hash the user's password for security
    hashed_password = generate_password_hash(password, method='sha256')

    # Create the new account
    new_user = User(email=email, password=hashed_password, description=description)
    db.session.add(new_user)  # Add the new user to the database session
    db.session.commit()  # Commit the transaction to save the new user

    return jsonify({"message": "Account created successfully!"}), 201  # Return success message


# Route to handle user login
@routes_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json  # Extract the incoming JSON data from the request

    email = data.get('email')
    password = data.get('password')

    # Check if any required fields are missing
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400  # Return error if email or password is missing

    # Check if the user exists and if the password matches
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 400  # Return error if credentials are invalid

    # Generate a JWT token that expires in 1 hour
    token = create_access_token(identity=user.email, expires_delta=datetime.timedelta(hours=1))

    return jsonify({"message": "Login successful!", "token": token}), 200  # Return success message and token