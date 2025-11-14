import React, { useState } from "react"

export default function LoginForm(){
        const [isLogin, setIsLogin]=useState(true)
    return(
        <div className='container'>
            <div className="heading">
                <h3>EcoSort</h3>
            </div>
            <div className="form-container">
                <div className="form-toggle">
                    <button className={isLogin ? 'active' : ""} onClick={()=>setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ""} onClick={()=>setIsLogin(false)}>Signup</button>
                </div>
                {isLogin ? <>
                <div className="form">
                    <h2>Login Form</h2>
                    <input type="email" placeholder="Email Address"/>
                    <input type="password" placeholder="Password"/>
                    <a href="#">Forgot Password?</a> 
                    <button>Login</button>
                    <p>Not a member? <a href="#" onClick={()=>setIsLogin(false)}>SignUp Now</a></p>
                </div>
                </> : <>
                <div className="form">
                    <h2>SignUp Form</h2>
                    <input type="email" placeholder="Email Address"/>
                    <input type="password" placeholder="Password"/>
                    <input type="password" placeholder="Confirm Password"/>
                    <button>Sign Up</button>
                </div>
                </>}
            </div>
        </div>
    )
}