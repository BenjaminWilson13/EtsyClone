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
        <div className="modal-wrapper">

            <h1 className="form-title">Add a Review?</h1>
            <form className="form-box" onSubmit={onSubmit}>
                <ul className="errors-list">
                    {errors && Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label className="form-label">
                    Rating:
                    <input type='number' minLength={1} min={.5} max={5} step={0.5} value={rating} required onChange={(e) => setRating(e.target.value)} />
                </label>
                <label className="form-label">
                    Leave your review here:
                    <textarea  className="form-label" value={text} minLength={5} rows={10} maxLength={2000} required onChange={(e) => setText(e.target.value)} />
                </label>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}