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
    console.log(category)
    const history = useHistory(); 
    const dispatch = useDispatch();
    const AllProducts = useSelector(state => state.products.AllProducts)
    let allProducts = {}; 

    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [dispatch])

    if (!AllProducts) return (<div className='splash-page-product-box'>Loading...</div>)

    if (!category || category == 'All Products') {
        allProducts = Object.values(AllProducts)
    } else {
        allProducts = Object.values(AllProducts).filter((product) => {
            if (product.category == category) return true; 
            else return false; 
        })

    }


    return (
    <div className='splash-page-product-box'>
        {allProducts.map((product) => {
            return (
                <div key={product.id} className='product-box' onMouseEnter={() => {
                    const element = document.getElementById(`product-${product.id}`)
                    element.className = 'cover-inner'
                }} onMouseLeave={() => {
                    const element = document.getElementById(`product-${product.id}`)
                    element.className = 'hidden'
                }} onClick={() => history.push(`/products/${product.id}/display`)}>
                    <img className='image-inner' src={product.image_url} />
                    <div className='element-inner'>${Number.parseFloat(product.price).toFixed(2)}</div>
                    <div id={`product-${product.id}`} className='hidden'><p>Sold by: {product.owner_username}</p></div>
                </div>
            )
        })}
    </div>)
}