import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, fetchSpecificProduct } from '../../store/products';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./ProductDetail.css"
import OpenModalButton from '../OpenModalButton';
import EditProductModal from '../EditProductModal';
import { fetchAllShoppingCartItems, increaseProductQuantity } from '../../store/shoppingCart';
import AddReviewModal from '../AddReviewModal';
import ProductImageModal from '../ProductImageModal';

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

    function handleCommentDelete(e) {
        e.preventDefault();
        console.log(e.target.id)
        dispatch(deleteComment(e.target.id)).then((data) => {
            if (data) {
                setErrors(data)
            } else {
                dispatch(fetchSpecificProduct(productId))
            }
        })
    }

    if (!product || product.id !== parseInt(productId)) return <div>loading...</div>

    return (
        <div className='specific-product-display-wrapper'>
            <h1>{product.name}</h1>
            <div className='specific-product-upper'>
                <img className='specific-product-image' src={product.image_url} />
                <div className='product-upper-right'>



                    <p className='specific-product-category-label'>Price: </p>
                    <p className='specific-product-info'>${Number(product.price).toFixed(2)}</p>
                    <p className='specific-product-category-label'>Category: </p>
                    <p className='specific-product-info'>{product.category}</p>
                    <p className='specific-product-category-label'>Description: </p>
                    <p className='specific-product-info'>{product.description}</p>
                    <p className='specific-product-category-label'>Custom Creator: </p>
                    <p className='specific-product-info'>{product.owner_username}</p>

                    <p className='specific-product-category-label'>Quantity: </p>
                    {sessionUser ?
                        <form className='quantity-form' id={product.id} onSubmit={handleSubmit}>
                            <label>
                                <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                    {quantities.map((quantity) => {
                                        return (
                                            <option value={quantity}>{quantity}</option>
                                        )
                                    })}
                                </select>
                            </label>
                            <button>Add to Cart</button>
                            {addedToCart ? <span className='added-to-cart-notify'>You have added {quantity} to your cart!</span> : null}
                        </form> : null}
                    {sessionUser && product.owner_id === sessionUser.id ? <OpenModalButton buttonText="Edit" modalComponent={<EditProductModal newProduct={false} />} /> : null}
                </div>
            </div>
            <div className='specific-product-lower'>
                {Object.values(product.comments).length ? <h2>Reviews: </h2> : <h2>No Reviews! (yet)</h2>}
                {sessionUser && product.owner_id !== sessionUser.id ? <OpenModalButton buttonText="Add Review" modalComponent={<AddReviewModal />} /> : null}
                {Object.values(product.comments).map((comment) => {
                    return (
                        <div key={comment.id} className='comment-box'>
                            <p>Comment by: {comment.owner_username}</p>
                            <p>Rating: {comment.rating}</p>
                            <p>{comment.text}</p>
                            <form id={comment.id} onSubmit={handleCommentDelete}>
                                {sessionUser && sessionUser.id === comment.user_id ? <button type='submit' > Delete Comment </button> : null}
                            </form>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}