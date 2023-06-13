from app.models import db, Product, environment, SCHEMA
from sqlalchemy.sql import text

def seed_products(): 
    for product in [
        {
            "owner_id": 1, 
            "name": "product 1", 
            "price": 11.99, 
            "description": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words.", 
            "category": "Collectable"
        }, {
            "owner_id": 2, 
            "name": "product 2", 
            "price": 12.99, 
            "description": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words.", 
            "category": "Electronics"
        }, {
            "owner_id": 3, 
            "name": "product 3", 
            "price": 13.99, 
            "description": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words.", 
            "category": "Outdoor"
        }, {
            "owner_id": 1, 
            "name": "product 4", 
            "price": 14.99, 
            "description": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words.", 
            "category": "Jewelry"
        }, {
            "owner_id": 2, 
            "name": "product 5", 
            "price": 15.99, 
            "description": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words.", 
            "category": "Artwork"
        }, {
            "owner_id": 3, 
            "name": "product 6", 
            "price": 16.99, 
            "description": "Words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words words.", 
            "category": "Clothing"
        }
    ]: 
        db.session.add(Product(**product))
        db.session.commit()

def undo_products(): 
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
        
    db.session.commit()