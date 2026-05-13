import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'


let header ={ token: localStorage.getItem('userToken')}
export let cartContext = createContext();

export default function CartContextProvider(props) {

  let [cartNumber , setCartNumber] = useState(0);
  
  function addProductToCart(id){
    return axios.post(
      `https://ecommerce.routemisr.com/api/v1/cart`,
      { productId: id },
      { headers: header }
    ).then((response)=>{
        console.log('response' , response)
        setCartNumber(response.data.numOfCartItems)
        return response}
      )
      .catch((error)=>error)
  }
  function getProductToCart(){
    return axios.get(
      `https://ecommerce.routemisr.com/api/v1/cart`,
      { headers: header }
    ).then((response)=>{
        setCartNumber(response.data.numOfCartItems)
        return response}
      )
      .catch((error)=>error)
  }
  function deleteProductFromCart(productId){
    return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
    { headers: header }
    ).then((response)=>{
        setCartNumber(response.data.numOfCartItems)
        return response}
      )
      .catch((error)=>error)
  }
  function updateProductInCart(Id,count){
    return axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${Id}`, 
    { count: count },
    { headers: header },
    );
  }

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      getProductToCart();
    }
  }, []);
  
  
  return <cartContext.Provider value={{addProductToCart, getProductToCart, deleteProductFromCart, updateProductInCart, cartNumber}}>
    {props.children}
  </cartContext.Provider>
}
