import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAllProducts } from '../../store/products';
import './SplashPage.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function SplashPage() {
    const sessionUser = useSelector(state => state.session.user);
    const { category } = useParams();
    const history = useHistory(); 
    const dispatch = useDispatch();
    const allProducts = useSelector(state => state.products.AllProducts)
    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [dispatch])

    if (!allProducts) return (<div className='splash-page-product-box'>Loading...</div>)

    return (<div className='splash-page-product-box'>
        {Object.values(allProducts).map((product) => {
            return (
                <div key={product.id} className='product-box' onMouseEnter={() => {
                    const element = document.getElementById(`product-${product.id}`)
                    element.className = 'cover-inner'
                }} onMouseLeave={() => {
                    const element = document.getElementById(`product-${product.id}`)
                    element.className = 'hidden'
                }} onClick={() => history.push(`/products/${product.id}`)}>
                    <img className='image-inner' src={product.image_url} />
                    <div className='element-inner'>${product.price}</div>
                    <div id={`product-${product.id}`} className='hidden'><p>Sold by: {product.owner_username}</p></div>
                </div>
            )
        })}
    </div>)
}