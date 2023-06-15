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
    const [category, setCategory] = useState(!newProduct ? product.category : 'Outdoor')
    const [image_url, setImage_url] = useState(!newProduct ? product.image_url : '')
    const [errors, setErrors] = useState(null);
    const dispatch = useDispatch();
    const categories = ['Artwork', 'Automotive', 'Clothing', 'Collectable', 'Electronic', 'Jewelry', 'Outdoor']
    const { closeModal } = useModal();
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        const split = image_url.split('.')
        const acceptedFormats = ['jpg', 'jpeg', 'png', 'gif']
        if (!acceptedFormats.includes(split[split.length - 1])) {
            console.log("hmm")
            setErrors({ "error": ["Accepted image formats are jpg, jpeg, png, and gif"] })
            return
        }
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
        const data = await dispatch(deleteProduct(product.id))
        if (data) {
            setErrors(data)
        } else {
            history.push("/")
            closeModal();
        }
    }

    return (
        <div className='edit-product-modal-wrapper'>
            <h1>Heyo</h1>
            <form onSubmit={handleSubmit} className='edit-product-form'>
                <ul className="errors">
                    {errors && Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Product Name:
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type='number' step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} />
                </label>
                <label>
                    Description:
                    <textarea type='textarea' maxLength={2000} minLength={20} value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label>
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
                <label>
                    Display image URL:
                    <input type='URL' value={image_url} onChange={(e) => setImage_url(e.target.value)} />
                </label>
                <button type='sumbit'>Submit</button>
            </form>
            {newProduct ? <button onClick={handleDelete}>Delete</button> : null}
        </div>
    )
}