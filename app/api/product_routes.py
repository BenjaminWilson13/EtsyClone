from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Product, db
from app.forms import ProductForm

product_routes = Blueprint('products', __name__)


@product_routes.route('/')
def get_all_products():
    products = Product.query.all(); 
    return {product.id: product.to_dict() for product in products}


@product_routes.route('/<string:category>')
def get_products_by_category(category): 
    products = Product.query.filter(Product.category == category).all()
    return {product.id: product.to_dict() for product in products}

@product_routes.route('/<int:product_id>')
def get_product_detail(product_id): 
    product = Product.query.get(product_id)
    return product.to_dict_detail(); 


@login_required
@product_routes.route('/', methods=["POST"])
def post_new_product(): 
    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate(): 
        print('validated')
        res = Product(
            name = form.data['name'],
            price = form.data['price'],
            description = form.data['description'],
            category = form.data['category'],
            owner_id = form.data['owner_id'],
            image_url = form.data['image_url']
        )

        db.session.add(res)
        db.session.commit()
        return res.to_dict_detail()
    else: 
        errors = form.errors
        print(errors)
        return errors, 400


@login_required
@product_routes.route('/<int:product_id>', methods=["PUT"])
def edit_product(product_id): 
    '''
        Body: {
        id: int, 
        name: string, 
        price: float, 
        description: string(2000), 
        category: string, 
        owner_id: int, 
        image_url: string, url
        }
    '''
    print('here')
    product = Product.query.get(product_id)
    if product.owner_id != current_user.id: 
        return {'errors': ['Only the product owner may edit']}, 403
    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate(): 
        product.name = form.data['name']
        product.price = form.data['price']
        product.description = form.data['description']
        product.category = form.data['category']
        product.image_url = form.data['image_url']
        db.session.commit()
        return product.to_dict_detail()
    else: 
        errors = form.errors
        print(errors)
        return errors, 400

@login_required    
@product_routes.route('/<int:product_id>', methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if current_user.id != product.owner_id: 
        return {'errors': ["Only the owner of the product my delete it"]}
    else: 
        db.session.delete(product)
        db.session.commit()
        return {"message": ["Product successfully deleted"]}

