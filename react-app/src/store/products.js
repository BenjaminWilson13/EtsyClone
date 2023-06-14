const GET_ALL_PRODUCTS = "products/GET_ALL_PRODUCTS"
const GET_SPECIFIC_PRODUCT = "products/GET_SPECIFIC_PRODUCT"

const getAllProducts = (data) => ({
    type: GET_ALL_PRODUCTS, 
    payload: data
}); 

const getSpecificProduct = (data) => ({
    type: GET_SPECIFIC_PRODUCT, 
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
            newState.SpecificProduct = {...action.payload}
            return newState; 
        default: 
            return state; 
    }
}