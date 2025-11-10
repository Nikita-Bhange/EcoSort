import React from 'react'

function Aimsection() {
    return (
        <section className='bg-gray-50 min-h-screen flex flex-col justify-center items-center text-center '>
            <div className='gap-5'>
                <h2 className='text-5xl font-bold text-gray-900 pb-4'>OUR MISSION</h2>
                
                <p className='font-semibold mt-6 text-xl '>
                   Our goal is to create an intelligent and efficient waste classification system that empowers communities <br/>
                    to make sustainable choices at the point of disposal.
                    By integrating A.I into waste management, <br/>
                    we aim to minimize human error, encourage recycling accuracy, and actively support global climate action efforts.
                </p>

                <p className='leading-tight font-semibold mt-5 text-xl'>
                    Even a small improvement in correct waste sorting can have a massive environmental benefit.<br/>
                    With EcoSort’s smart recognition technology, reducing improper disposal by just 1% <br/> could help cut emissions on a scale comparable to removing millions of fuel-based vehicles from daily use.<br/>
                    Together, we can transform waste management into a key driver for a cleaner and more sustainable planet.
                </p>
               
            </div>
        </section>
    )
}

export default Aimsection