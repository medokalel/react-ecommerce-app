import React, { createContext, useEffect, useState } from 'react'

export let userContext = createContext()


export default function UserContextProvider(props) {
  let [isLogin,setLogin]=useState(null);
  useEffect(()=>{
    if(localStorage.userToken !== null){
      setLogin(localStorage.userToken)
    }
  } ,[])

  return (
    <userContext.Provider value={{isLogin,setLogin}}>
      {props.children}
    </userContext.Provider>
  )
}
