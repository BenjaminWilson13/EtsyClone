const GET_ALL_PRODUCTS = "products/GET_ALL_PRODUCTS"

const getAllProducts = (data) => ({
    type: GET_ALL_PRODUCTS, 
    payload: data
}); 

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

const initialState = {
    AllProducts: {}, 
    CategoryProducts: {}
}

export default function reducer(state = initialState, action) {
    const newState = {...state, AllProducts: {...state.AllProducts}, CategoryProducts: {...state.CategoryProducts}}
    switch(action.type) {
        case GET_ALL_PRODUCTS: 
            newState.AllProducts = {...action.payload}; 
            return newState; 
        default: 
            return state; 
    }
}