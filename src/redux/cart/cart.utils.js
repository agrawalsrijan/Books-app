export const addItemToCart = (cartItems, cartItemToAdd) => {
    const existingCartItem = cartItems.find(
        cartItem => cartItem.bookID===cartItemToAdd.bookID
    );
    if (existingCartItem) {
        return cartItems.map(cartItem => 
            cartItem.bookID === cartItemToAdd.bookID
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem    
            )
    }

    return [...cartItems, {...cartItemToAdd, quantity: 1 }];
} 

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
    const existingCartItem = cartItems.find(
        cartItem => cartItem.bookID === cartItemToRemove.bookID
    );

    if(existingCartItem.quantity ===1) {
        return cartItems.filter(cartItem => cartItem.bookID !== cartItemToRemove.bookID)
    }
    return cartItems.map(cartItem =>
        cartItem.bookID === cartItemToRemove.bookID
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
    )
}