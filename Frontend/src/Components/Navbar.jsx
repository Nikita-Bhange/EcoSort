import React from 'react'
import { Link, NavLink } from "react-router-dom";
function Navbar() {
    const style='text-2xl font-bold text-white items-center hover:text-amber-100 hover:text-[25px] hover:cursor-pointer pt-1'
  return (
    <>

        <div className='h-[7rem] bg-green-700 shadow-lg relative pt-7 pl-28 pr-28 m-0 '>
            <div className='flex justify-between'>
            <p className='text-4xl shadow-amber-50  text-white font-bold'>EcoSort</p>
            <ul className='flex gap-8 '>
                
                <NavLink to='/'>
                    <p className={style}>
                    Home
                    </p>
                </NavLink>
                 <NavLink to='/'>
                    <p className={style}>
                    Home
                    </p>
                </NavLink>
                 <NavLink to='/'>
                    <p className={style}>
                    Home
                    </p>
                </NavLink>
                
            </ul>
            </div>
        </div>
    </>
  )
}

export default Navbar