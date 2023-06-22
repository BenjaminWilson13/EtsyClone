from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Product, db, ShoppingCart
from app.forms import ProductForm

shopping_cart_routes = Blueprint('shoppingCart', __name__)

@shopping_cart_routes.route('/')
def get_all_cart_items(): 
    
    products = [product.to_dict() for product in current_user.shopping_cart]

    for product in products: 
        product['quantity'] = ShoppingCart.query.filter(ShoppingCart.user_id == current_user.id, ShoppingCart.product_id == product['id']).count()
    
    return {product['id']: product for product in products}


@shopping_cart_routes.route('/', methods=["POST"])
def add_item_to_cart(): 
    '''
        body: {
            product_id: integer, 
            quantity: integer
        }
    '''
    data = request.get_json()
    quantity = data['quantity']
    print(quantity)

    count = 0
    while count < int(quantity): 
        item = ShoppingCart(
                    product_id=data['product_id'], 
                    user_id=current_user.id
                )
        db.session.add(item)
        count = count + 1
    db.session.commit()

    return {"message": ["Added successfully"]}

@shopping_cart_routes.route('/<int:product_id>/<int:quantity>', methods=["DELETE"])
def remove_item_from_cart(product_id, quantity): 
    count = 0
    while count < quantity: 
        product = ShoppingCart.query.filter(ShoppingCart.product_id == product_id, ShoppingCart.user_id == current_user.id).first()
        if product: 
            db.session.delete(product)
        else: 
            return {"message": ["Can't delete more products than are in the cart"]}
        count = count + 1
    db.session.commit()
    return {"message": ["Removed successfully"]}


@shopping_cart_routes.route('/clear-cart', methods=["DELETE"])
def clear_cart(): 
    cart_list = ShoppingCart.query.filter(ShoppingCart.user_id == current_user.id).all()

    [db.session.delete(item) for item in cart_list]
    db.session.commit() 
    return {"Message": ["Cart cleared successfully"]}