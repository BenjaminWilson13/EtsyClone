from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError, Length, URL
from app.models import Product, User

def name_exists(form, field): 
    name = field.data
    product = Product.query.filter(Product.name == name).first()
    if product: 
        raise ValidationError("Product name already exists")
    
def user_exists(form, field): 
    id = field.data
    user = User.query.get(id)
    if not user: 
        raise ValidationError("User does not exist")
    


class ProductForm(FlaskForm): 
    name = StringField('name', validators=[DataRequired(), name_exists])
    price = FloatField('price', validators=[DataRequired()])
    description = StringField('description', validators=[DataRequired(), Length(min=25, max=2000, message="Description must be between 25 and 2000 characters long")])
    category = StringField('category', validators=[DataRequired()])
    owner_id = IntegerField('owner', validators=[DataRequired(), user_exists])
    image_url = StringField('image', validators=[URL()])