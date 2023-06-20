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
    const [quantity, setQuantity] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllShoppingCartItems())
    }, [dispatch])

    function handleSubmit(e) {
        e.preventDefault();
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

    function handleFakeCheckout(e) {
        e.preventDefault(); 
        alert("Feature coming soon!")
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
                                    <p className='cart-product-name'>{product.name}</p>
                                    <p className='cart-product-category'>{product.category}</p>
                                    <form className='cart-quantity-form' id={product.id} onSubmit={handleSubmit} >
                                        <input type='number' max='99' min='1' id={product.id} defaultValue={product.quantity} onChange={(e) => setQuantity(e.target.value)} />
                                        <button type='submit'>Update Quantity</button>
                                        <button className='delete-button' id={product.id} onClick={handleDelete}>Delete</button>
                                    </form>
                                    <div className='cart-description'>{product.description}</div>
                                </div>
                                <div className='cart-item-box-right'>
                                    <p>Item cost: ${Number.parseFloat(product.price * product.quantity).toFixed(2)}</p>
                                    {product.quantity > 1 ? <p>(${Number.parseFloat(product.price).toFixed(2)}each)</p> : null}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <span>How you'll pay</span> <br />
                    <span>Total Cost: ${Number.parseFloat(total).toFixed(2)}</span>
                        <fieldset className='payment-methods'>
                            <label for='Visa'>Visa</label>
                            <input type='radio' name='payment' id='Visa'/>
                            <label for='PayPal'>PayPal</label>
                            <input type='radio' name='payment' id='PayPal'/>
                            <label for='E-Check'>E-Check</label>
                            <input type='radio' name='payment' id='E-Check'/>
                            <button onClick={handleFakeCheckout}>Checkout</button>
                        </fieldset>
                </div>
            </div>
        </div>
    )
}