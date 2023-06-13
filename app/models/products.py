from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class Product(db.Model):
    __tablename__ = 'products'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True)
    price = db.Column(db.Float)
    description = db.Column(db.String(2000))
    category = db.Column(db.String)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    image_url = db.Column(db.String, default="https://cdn.discordapp.com/attachments/196747874552381440/1118291733785088061/box-carton-delivery-line-style-icon-free-vector.png")

    owner = db.relationship("User", back_populates="products")
    in_cart = db.relationship("User", back_populates="shopping_cart", secondary="shopping_carts")
    comments = db.relationship("Comment", back_populates="product", cascade="delete-orphan, all")


    def to_dict(self): 
        return {
            "id": self.id, 
            "name": self.name, 
            "price": self.price, 
            "description": self.description
        }