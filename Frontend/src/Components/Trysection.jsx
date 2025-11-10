import React from 'react'
import { NavLink } from 'react-router-dom'
function Trysection() {
  return (
    <>
    <section className='h-screen flex justify-center items-center flex-col bg-[#C3F3C0]'>
        <div className='max-w-3xl text-center  flex justify-center items-center flex-col gap-8'>
        <p className='text-3xl font-bold text-gray-900 leading-tight  text-shadow-gray-400 text-shadow-sm'>AI-Powered Waste Classification System for <br/> Sustainable Waste Management and<br/> Climate Change Mitigation</p>
        <div className='mt-8'>
            <button className="px-6 py-3 rounded-full text-2xl text-white font-semibold shadow-lg  bg-green-700 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-green-300 cursor-pointer">Try the tool</button>
        </div>
        </div>
    </section>
    </>
  )
}

export default Trysection