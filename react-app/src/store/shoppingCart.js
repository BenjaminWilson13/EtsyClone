const GET_ITEMS_IN_CART = 'shoppingCart/GET_ITEMS_IN_CART'

const getAllItems = (data) => ({
    type: GET_ITEMS_IN_CART, 
    payload: data
})


export const fetchAllShoppingCartItems = () => async (dispatch) => {
    const res = await fetch('/api/shoppingCart/')
    const data = await res.json(); 
    if (res.ok) {
        dispatch(getAllItems(data))
        return null
    } else {
        return {"error": ["Something went wrong"]}
    }
}

export const increaseProductQuantity = (body) => async (dispatch) => {
    const res = await fetch(`/api/shoppingCart/`, {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(body)
    })
    if (res.ok) {
        return null; 
    } else {
        const data = await res.json(); 
        return data; 
    }
}

export const decreaseProductQuantity = (product_id, change) => async (dispatch) => {
    const res = await fetch(`/api/shoppingCart/${product_id}/${change}`, {
        method: "DELETE"
    })
    if (res.ok) {
        return null; 
    } else {
        const data = await res.json(); 
        return data;
    }
}


const initialState = {
    InCartItems: {}
}

export default function reducer(state = initialState, action) {
    const newState = {...state, InCartItems: {...state.InCartItems}}
    switch(action.type) {
        case GET_ITEMS_IN_CART: 
            newState.InCartItems = {...action.payload}
            return {'InCartItems': {...action.payload}}; 
        default: 
            return state; 
    }
}