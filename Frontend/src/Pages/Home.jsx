import React from 'react'
import Navbar from '../Components/Navbar'
import Categories from '../Components/Category'
import HowItWorks from '../Components/HowitWorks'
import Footer from '../Components/Footer'
import HomePage from '../Components/HomePage'

const Home = () => {
  return (
    <>
    <Navbar/>
    <HomePage/>
    <Categories/>
    <HowItWorks/>
    <Footer/>
    </>
  )
}

export default Home