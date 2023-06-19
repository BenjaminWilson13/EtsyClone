import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchSpecificProduct, postNewComment, postNewProduct, putEditProduct } from '../../store/products';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./AddReviewModal.css"
import { useModal } from '../../context/Modal';

export default function AddReviewModal() {
    const product = useSelector(state => state.products.SpecificProduct)
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [rating, setRating] = useState(null);
    const [text, setText] = useState('');
    const [errors, setErrors] = useState(null);
    const { closeModal } = useModal();

    function onSubmit(e) {
        e.preventDefault();

        const body = {
            user_id: sessionUser.id,
            product_id: product.id,
            rating,
            text
        }
        dispatch(postNewComment(body)).then((data) => {
            if (data) {
                setErrors(data);
            } else {
                dispatch(fetchSpecificProduct(product.id))
                closeModal(); 
            }
        })
    }

    return (
        <div className='comment-form-wrapper'>

            <h1>Heyo</h1>
            <form onSubmit={onSubmit}>
                <ul className="errors">
                    {errors && Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Rating:
                    <input type='number' minLength={1} min={.5} max={5} step={0.5} value={rating} onChange={(e) => setRating(e.target.value)} />
                </label>
                <label>
                    Leave your review here:
                    <textarea value={text} minLength={5} maxLength={2000} onChange={(e) => setText(e.target.value)} />
                </label>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}