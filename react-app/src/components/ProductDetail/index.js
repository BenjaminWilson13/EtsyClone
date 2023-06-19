import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecificProduct } from '../../store/products';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./ProductDetail.css"
import OpenModalButton from '../OpenModalButton';
import EditProductModal from '../EditProductModal';
import { fetchAllShoppingCartItems, increaseProductQuantity } from '../../store/shoppingCart';
import AddReviewModal from '../AddReviewModal';

export default function ProductDetail() {
    const { productId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const product = useSelector(state => state.products.SpecificProduct)
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [errors, setErrors] = useState(null)
    console.log(productId)
    useEffect(() => {
        dispatch(fetchSpecificProduct(productId))
    }, [dispatch])
    const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    function handleSubmit(e) {
        e.preventDefault();
        console.log(quantity)
        const body = {
            product_id: productId,
            quantity
        }

        dispatch(increaseProductQuantity(body)).then((data) => {
            if (data) {
                setErrors(data)
            } else {
                dispatch(fetchAllShoppingCartItems());
                setAddedToCart(true);
            }
        })

    }

    if (!product || product.id !== parseInt(productId)) return <div>loading...</div>

    return (
        <div className='specific-product-display-wrapper'>
            <h1>{product.name}</h1>
            <div className='specific-product-upper'>
                <img src={product.image_url} />
                <div className='product-upper-right'>
                    <p>Price: ${Number(product.price).toFixed(2)}</p>
                    <p>Category: {product.category}</p>
                    <p>Description: {product.description}</p>
                    <p>Custom Creator: {product.owner_username}</p>
                    {sessionUser && product.owner_id === sessionUser.id ? <OpenModalButton className='edit-product-button' buttonText="Edit" modalComponent={<EditProductModal newProduct={false} />} /> : null}
                    {sessionUser ?
                        <form id={product.id} onSubmit={handleSubmit}>
                            <label>
                                Quantity:
                                <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                    {quantities.map((quantity) => {
                                        return (
                                            <option value={quantity}>{quantity}</option>
                                        )
                                    })}
                                </select>
                            </label>
                            <button>Add to Cart</button>
                        </form> : null}
                    {addedToCart ? <p>You have added {quantity} to your cart!</p> : null} 
                </div>
            </div>
            <div className='specific-product-lower'>
                <h2>Reviews: </h2>
                {sessionUser && product.owner_id !== sessionUser.id ? <OpenModalButton buttonText="Add Review" modalComponent={<AddReviewModal />} /> : null}
                {Object.values(product.comments).map((comment) => {
                    return (
                        <div key={comment.id} className='comment-box'>
                            <p>Comment by: {comment.owner_username}</p>
                            <p>Rating: {comment.rating}</p>
                            <p>{comment.text}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}