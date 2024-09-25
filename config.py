class Config:
    # Basic configuration for the Flask application
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://cis440demo:cis440democis440demo@107.180.1.16:3306/cis440demo'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'radchat'  # You should replace this with a stronger key in production