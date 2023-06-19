from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Product, db, Comment
from app.forms import ProductForm, CommentForm

comment_routes = Blueprint('comments', __name__)

@comment_routes.route('/', methods=['POST'])
def add_comment(): 
    '''
        body: {
            product_id: integer, 
            user_id: integer, 
            rating: float, 
            text: string(5, 2000)
        }
    '''
    
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate(): 
        print('validated')
        res = Comment(
            user_id = form.data['user_id'], 
            product_id = form.data['product_id'], 
            rating = form.data['rating'], 
            text = form.data['text']
        )
        db.session.add(res)
        db.session.commit()
        return {'message': ['successfully added']}
    else: 
        errors = form.errors
        return errors, 400
    

@comment_routes.route('/<int:comment_id>', methods=["DELETE"])
def delete_comment(comment_id): 

    comment = Comment.query.get(comment_id)
    if comment.user_id == current_user.id: 
        db.session.delete(comment)
        db.session.commit()
        return {"message": ["Comment deleted successfully"]}
    else: 
        return {"message": ["Only the creator can delete this comment"]}, 401