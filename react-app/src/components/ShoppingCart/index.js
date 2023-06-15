import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchSpecificProduct, postNewProduct, putEditProduct } from '../../store/products';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./ShoppingCart.css"
import { useModal } from '../../context/Modal';
import { decreaseProductQuantity, fetchAllShoppingCartItems, increaseProductQuantity } from '../../store/shoppingCart';

export default function ShoppingCart() {
    const sessionUser = useSelector(state => state.session.user);
    const products = useSelector(state => state.cartItems.InCartItems);
    const [errors, setErrors] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllShoppingCartItems())
    }, [dispatch])

    function handleSubmit(e) {
        e.preventDefault();
        const quantity = e.target.value;
        const product_id = e.target.id;
        const change = quantity - products[product_id].quantity;
        if (change > 0) {
            const body = {
                product_id,
                quantity: change
            }
            dispatch(increaseProductQuantity(body)).then((data) => {
                if (data) {
                    setErrors(data)
                } else {
                    dispatch(fetchAllShoppingCartItems())
                }
            })
        } else if (change <= 0) {
            console.log(change * -1)
            dispatch(decreaseProductQuantity(product_id, change * -1)).then((data) => {
                if (data) {
                    setErrors(data)
                } else {
                    dispatch(fetchAllShoppingCartItems())
                }
            })
        }

    }

    function handleDelete(e) {
        e.preventDefault();
        const product_id = e.target.id
        dispatch(decreaseProductQuantity(product_id, products[product_id].quantity)).then((data) => {
            if (data) {
                setErrors(data)
            } else {
                dispatch(fetchAllShoppingCartItems())
            }
        })
    }

    const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    if (!products) return (<div className='shopping-cart-wrapper'>Loading...</div>)

    let total = 0; 

    for (let product of Object.values(products)) {
        total += product.price * product.quantity
    }


    return (
        <div className='shopping-cart-wrapper'>
            <h1>{Object.values(products).length} item(s) in your cart</h1>
            {Object.values(products).map((product) => {
                return (
                    <div>
                        {product.name}
                    </div>
                )
            })}
            <div className='shopping-cart-upper'>
                <div className='cart-items'>

                    {Object.values(products).map((product) => {
                        return (
                            <div className='cart-item-box'>
                                <div className='cart-item-box-left'>
                                    <h4>Sold by: {product.owner_username}</h4>
                                    <img className='product-image' src={product.image_url} />
                                </div>
                                <div className='cart-item-box-center'>
                                    <span>{product.name}</span> <br />
                                    <span>{product.category}</span> <br />
                                    <form >
                                        <select id={product.id} defaultValue={product.quantity} onChange={handleSubmit}>
                                            {quantities.map((quantity) => {
                                                return (
                                                    <option value={quantity}>{quantity}</option>
                                                )
                                            })}
                                        </select>
                                    </form>
                                    <button id={product.id} onClick={handleDelete}>Delete</button>

                                </div>
                                <div className='cart-item-box-right'>
                                    <span>${product.price * product.quantity}</span> <br />
                                    {product.quantity > 1 ? <span>(${product.price}each)</span> : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <span>How you'll pay</span> <br />
                    <span>Total Cost: ${total}</span>
                </div>
            </div>
        </div>
    )
}