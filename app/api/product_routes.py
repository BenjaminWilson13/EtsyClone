from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Product, db
from app.forms import ProductForm
from .AWS_helpers import upload_file_to_s3, remove_file_from_s3, get_unique_filename

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
    if request.files:
        file = request.files["image_url"]
        file.filename = get_unique_filename(file.filename)
        output = upload_file_to_s3(file)

    # If we have a file, upload it to our bucket
        # output will have the return value of the file name itself
        

    if form.validate(): 
        if request.files: 
            res = Product(
                name = form.data['name'],
                price = form.data['price'],
                description = form.data['description'],
                category = form.data['category'],
                owner_id = form.data['owner_id'], 
                image_url = f"https://benwilsonbucket.s3.amazonaws.com/{output}"
            )
        else : 
            res = Product(
                name = form.data['name'],
                price = form.data['price'],
                description = form.data['description'],
                category = form.data['category'],
                owner_id = form.data['owner_id'], 
                image_url = 'https://media.discordapp.net/attachments/196747874552381440/1118291733785088061/box-carton-delivery-line-style-icon-free-vector.png'
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
    form['id'].data = product.id

    # If we have a file, upload it to our bucket
    if request.files:
        file = request.files["image_url"]
        # output will have the return value of the file name itself
        file.filename = get_unique_filename(file.filename)
        output = upload_file_to_s3(file)
        remove_file_from_s3(product.image_url)
        product.image_url = f"https://benwilsonbucket.s3.amazonaws.com/{output}"

    if form.validate(): 
        product.name = form.data['name']
        product.price = form.data['price']
        product.description = form.data['description']
        product.category = form.data['category']
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
        remove_file_from_s3(product.image_url)
        db.session.delete(product)
        db.session.commit()
        return {"message": ["Product successfully deleted"]}

