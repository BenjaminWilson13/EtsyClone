import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecificProduct } from '../../store/products';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./ProductDetail.css"
import OpenModalButton from '../OpenModalButton';
import EditProductModal from '../EditProductModal';

export default function ProductDetail() {
    const { productId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const product = useSelector(state => state.products.SpecificProduct)
    console.log(productId)

    useEffect(() => {
        dispatch(fetchSpecificProduct(productId))
    }, [dispatch])

    if (!product || product.id !== parseInt(productId)) return <div>loading...</div>

    return (
        <div className='specific-product-display-wrapper'>
            <h1>{product.name}</h1>
            <div className='specific-product-upper'>
                <img src={product.image_url} />
                <div className='product-upper-right'>
                    <p>Price: {product.price}</p>
                    <p>Category: {product.category}</p>
                    <p>Description: {product.description}</p>
                    <p>Custom Creator: {product.owner_username}</p>
                    {sessionUser && product.owner_id === sessionUser.id ? <OpenModalButton className='edit-product-button' buttonText="Edit" modalComponent={<EditProductModal newProduct={false}/>} /> : null}
                </div>
            </div>
            <div className='specific-product-lower'>
                <h2>Reviews: </h2>
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