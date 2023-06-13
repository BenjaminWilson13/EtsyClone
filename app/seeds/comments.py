from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments(): 
    for comment in [ 
        {
            "user_id": 1, 
            "product_id": 2, 
            "rating": 5.0, 
            "text": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words."
        }, {
            "user_id": 2, 
            "product_id": 1, 
            "rating": 5.0, 
            "text": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words."
        }, {
            "user_id": 3, 
            "product_id": 2, 
            "rating": 5.0, 
            "text": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words."
        }
    ]: 
        db.session.add(Comment(**comment))
        db.session.commit()

def undo_comments(): 
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()