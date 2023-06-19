from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User, Comment, Product

def user_exists(form, field): 
    id = field.data
    user = User.query.get(id)
    if not user: 
        raise ValidationError("User does not exist")
    
def product_exists(form, field): 
    id = field.data
    product = Product.query.get(id)
    if not product: 
        raise ValidationError("Product does not exist")

class CommentForm(FlaskForm): 
    user_id = IntegerField('user_id', validators=[DataRequired(), user_exists])
    product_id = IntegerField('product_id', validators=[DataRequired(), product_exists])
    rating = FloatField('rating', validators=[DataRequired(message='A rating is required')])
    text = StringField('Comment Text', validators=[Length(min=5, max=2000, message="Comments must be between 5 and 2000 characters long")])
    