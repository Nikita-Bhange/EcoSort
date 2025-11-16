import React from 'react'
import Navbar from "../Components/Navbar";
import Slider from "../Components/Slider";
import Trysection from "../Components/Trysection";
import Aimsection from "../Components/Aimsection";
import Footer from "../Components/Footer";

/*imported images */
import image1 from '../assets/image1.jpg'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.jpg'
import image6 from '../assets/image6.jpg'

const images = [image6, image2,image3,image1]

function Home(){
    return(
        <>
        <Navbar/>
       <Slider imageUrls={images}/>
       <Trysection/>
       <Aimsection/>
       <Footer/>
        </>
    )
}

export default Home;