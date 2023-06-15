import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchSpecificProduct, postNewProduct, putEditProduct } from '../../store/products';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./ShoppingCart.css"
import { useModal } from '../../context/Modal';

export default function ShoppingCart() {
    return (
        <div className='shopping-cart-wrapper'>
            
        </div>
    ) 
}