import React, { useState, useEffect } from 'react';




const App = ()=> {
  const [user,setUser]=  useState([])

  const getUser=()=>{
    fetch("/api/user")
    .then(res=>res.json())
    .then(json=>setUser(json))
  }

  useEffect(()=>{
    getUser()
  },[])
  return(
    <div>
       {user.map((data)=>{
        return <>
        <div sytle={{border:"1px solid gray",width:"500px"}}>
        <h1>Name :{data.name}</h1>
        <h1>Username:{data.username}</h1>
        <h1>Email:{data.email}</h1>
        </div>
        </>
        
       })}
    </div>
  )
}

export default App