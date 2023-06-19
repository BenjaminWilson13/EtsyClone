const GET_ALL_PRODUCTS = "products/GET_ALL_PRODUCTS"
const GET_SPECIFIC_PRODUCT = "products/GET_SPECIFIC_PRODUCT"
const PUT_PRODUCT = 'products/PUT_PRODUCT'
const DELETE_PRODUCT = 'products/DELETE_PRODUCT'
const CREATE_PRODUCT = 'products/CREATE_PRODUCT'

const getAllProducts = (data) => ({
    type: GET_ALL_PRODUCTS, 
    payload: data
}); 

const getSpecificProduct = (data) => ({
    type: GET_SPECIFIC_PRODUCT, 
    payload: data
})

const editProduct = (data) => ({
    type: PUT_PRODUCT, 
    payload: data
})

const deleteSpecificProduct = () => ({
    type: DELETE_PRODUCT
})

const createNewProduct = (data) => ({
    type: CREATE_PRODUCT, 
    payload: data
})

export const fetchAllProducts = () => async (dispatch) => {
    const res = await fetch("/api/products/"); 
    const data = await res.json(); 
    if (res.ok) {
        dispatch(getAllProducts(data)); 
        return null; 
    } else {
        return {"error": ["Something went wrong"]}
    }
}

export const fetchSpecificProduct = (productId) => async (dispatch) => {
    const res = await fetch(`/api/products/${productId}`)
    const data = await res.json(); 
    if (res.ok) {
        dispatch(getSpecificProduct(data))
        return null; 
    } else {
        return {"error": ["Something went wrong"]}
    }
}

export const putEditProduct = (body) => async (dispatch) => {
    const res = await fetch(`/api/products/${body.id}`, {
        method:"PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(body)
    })
    const data = await res.json(); 
    if (res.ok) {
        dispatch(editProduct(data)); 
        return null; 
    } else {
        return data;
    }
}

export const deleteProduct = (productId) => async (dispatch) => {
    const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(deleteSpecificProduct()); 
        return null; 
    } else {
        const data = await res.json()
        return data; 
    }
}

export const postNewProduct = (body) => async (dispatch) => {
    const res = await fetch(`/api/products/`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(body)
    })
    const data = await res.json(); 
    if (res.ok) {
        dispatch(createNewProduct(data))
        return data.id
    } else {
        return data
    }
}

export const postNewComment = (body) => async (dispatch) => {
    const res = await fetch('/api/comments/', {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(body)
    })
    const data = await res.json(); 
    if (res.ok) {
        return null; 
    } else {
        return data; 
    }
}

const initialState = {
    AllProducts: {}, 
    CategoryProducts: {}, 
    SpecificProduct: {}
}

export default function reducer(state = initialState, action) {
    const newState = {...state, AllProducts: {...state.AllProducts}, CategoryProducts: {...state.CategoryProducts}, SpecificProduct: {...state.SpecificProduct}}
    switch(action.type) {
        case GET_ALL_PRODUCTS: 
            newState.AllProducts = {...action.payload}; 
            return newState; 
        case GET_SPECIFIC_PRODUCT: 
            newState.SpecificProduct = {...action.payload};
            return newState; 
        case PUT_PRODUCT: 
            newState.SpecificProduct = {...action.payload};
            return newState; 
        case DELETE_PRODUCT: 
            newState.SpecificProduct = {}; 
            return newState; 
        case CREATE_PRODUCT: 
            newState.SpecificProduct = {...action.payload}; 
            return newState; 
        default: 
            return state; 
    }
}