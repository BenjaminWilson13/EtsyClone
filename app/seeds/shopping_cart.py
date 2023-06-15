from app.models import db, ShoppingCart, environment, SCHEMA
from sqlalchemy.sql import text

def seed_shopping_carts(): 
    for cart in [
        {
            "user_id": 1, 
            "product_id": 2
        }, {
            "user_id": 1, 
            "product_id": 3
        }, {
            "user_id": 2, 
            "product_id": 1
        }, {
            "user_id": 2, 
            "product_id": 3
        }, {
            "user_id": 3, 
            "product_id": 1
        }, {
            "user_id": 3, 
            "product_id": 2
        }, {
            "user_id": 1, 
            "product_id": 2
        }
    ]: 
        db.session.add(ShoppingCart(**cart))
        db.session.commit()

def undo_shopping_carts(): 
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.shopping_carts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM shopping_carts"))
        
    db.session.commit()