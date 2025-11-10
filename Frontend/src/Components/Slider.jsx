import React from 'react'
import {BsArrowLeftCircleFill, BsArrowRightCircleFill} from 'react-icons/bs'
import { useState } from 'react'

function Slider({imageUrls}) {
  console.log(imageUrls)
  const [slide, setSlide] = useState(0)
   

  const nextSlide =()=>{
    setSlide(slide === imageUrls.length -1 ? 0 :slide+1)
  }

  const prevSlide =()=>{
    setSlide(slide === 0 ? imageUrls.length-1 :slide -1)
  }
  return (
    <>
    <section className=' bg-black h-screen flex justify-center '>
        <div className='carousel flex justify-center items-center w-full overflow-hidden'>
          <BsArrowLeftCircleFill className='arrow arrow-left  absolute w-8 h-8 text- left-4 cursor-pointer' onClick={prevSlide}/>
          {imageUrls.map((item,idx)=>{
            return <img src={item}  key={idx} className={slide ===idx ? 'slide  shadow-gray-600 shadow-lg w-full h-full' :  'slide rounded-xl shadow-gray-600 shadow-lg w-full h-full  hidden'}/> /*display :none is hidden in tailwind */
          })}
          <BsArrowRightCircleFill className='arrow arrow-right  absolute w-8 h-8 text- right-4 cursor-pointer' onClick={nextSlide}/>
          <span className='indicators  flex absolute bottom-4 '>
            {imageUrls.map((_, idx) =>{
            return <button key={idx} onClick={()=>setSlide(idx)} className={slide=== idx ?'indicator  bg-white h-2 w-2 rounded-full border-none outline-none mx-0 my-0.5 cursor-pointer':'  bg-white h-2 w-2 rounded-full border-none outline-none mx-0 my-0.5 cursor-pointer   bg-gray-600'}></button>})}
            </span>
        </div>
      </section>
    </>
  )
}

export default Slider