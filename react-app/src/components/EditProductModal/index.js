import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchSpecificProduct, postNewProduct, putEditProduct } from '../../store/products';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import "./EditProductModal.css"
import { useModal } from '../../context/Modal';


export default function EditProductModal({ newProduct }) {
    console.log(newProduct)

    const product = useSelector(state => state.products.SpecificProduct)
    const sessionUser = useSelector(state => state.session.user);
    const [name, setName] = useState(!newProduct ? product.name : '')
    const [price, setPrice] = useState(!newProduct ? product.price : '')
    const [description, setDescription] = useState(!newProduct ? product.description : '')
    const [category, setCategory] = useState(!newProduct ? product.category : 'Artwork')
    const [image_url, setImage_url] = useState(!newProduct ? product.image_url : '')
    const [errors, setErrors] = useState(null);
    const dispatch = useDispatch();
    const categories = ['Artwork', 'Automotive', 'Clothing', 'Collectable', 'Electronic', 'Jewelry', 'Outdoor']
    const { closeModal } = useModal();
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        
        const body = {
            name,
            price,
            description,
            category,
            image_url,
            owner_id: sessionUser.id,
            id: product.id
        }
        if (newProduct) {
            dispatch(postNewProduct(body)).then((data) => {
                console.log(data)
                if (isNaN(parseInt(data))) {
                    setErrors(data)
                } else {
                    history.push(`/products/${data}/display`)
                    closeModal();
                }
            })
        } else {
            dispatch(putEditProduct(body)).then((data) => {
                if (data) {
                    setErrors(data)
                } else {
                    closeModal();
                }
            })
        }
    }

    async function handleDelete(e) {
        e.preventDefault();
        console.log("deleted")
        dispatch(deleteProduct(product.id)).then((data) => {
            if (data) {
                setErrors(data)
            } else {
                history.push("/")
                closeModal();
            }
        })
    }

    return (
        <div className="modal-wrapper">
            <h1 className="form-title">List a new product for sale?</h1>
            <form onSubmit={handleSubmit} className='edit-product-form'>
                <ul className="errors-list">
                    {errors && Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label className="form-label">
                    Product Name:
                    <input type='text' value={name} minLength='10' maxLength='50' onChange={(e) => setName(e.target.value)} />
                </label>
                <label className="form-label">
                    Price:
                    <input type='number' step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <label className="form-label">
                    Description:
                    <textarea  className="form-label edit-product-text-area" type='textarea' maxLength={2000} minLength={20} value={description} onChange={(e) => setDescription(e.target.value)} />
                    Up to 2000 characters
                </label>
                <label className="form-label">
                    Category:
                    <select name='category' value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((category, idx) => {
                            console.log(category)
                            return (
                                <option key={idx} value={category}>{category}</option>
                            )
                        })}
                    </select>
                </label>
                <label className="form-label">
                    Display image:
                    <input type='file' accept='image/*' onChange={(e) => setImage_url(e.target.files[0])} />
                </label>
                <button type='submit'>Submit</button>
            </form>
            {!newProduct ? <button onClick={handleDelete}>Delete</button> : null}
        </div>
    )
}