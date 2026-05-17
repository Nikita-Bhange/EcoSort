// import React, { useState } from 'react'
// import { FaCamera } from "react-icons/fa"
// import Navbar from '../Components/Navbar'
// function Classification() {

//     const [preview, setPreview] = useState(null);

//     // Handle file selection
//     const handleFile = (file) => {
//         if (file && file.type.startsWith("image/")) {
//             const reader = new FileReader();
//             reader.onload = (e) => setPreview(e.target.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     // Trigger hidden input
//     const handleInputChange = (e) => {
//         const file = e.target.files[0];
//         handleFile(file);
//     };

//     // Drag & drop handlers
//     const handleDrop = (e) => {
//         e.preventDefault();
//         const file = e.dataTransfer.files[0];
//         handleFile(file);
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };



//     return (
//         <>
//             <Navbar />
//             <section className='flex flex-col items-center justify-center py-10 leading-1.5 gap-10'>
//                 <p className='text-3xl text-gray-600 font-semibold leading-1.5'>Dispose Smartly</p>
//                 <p className='text-2xl text-gray-700'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore eveniet, impedit officiis neque autem expedita explicabo sequi ex repellat eum?</p>
//                 <div className=' flex mt-10 flex-col  items-center' >
//                     <div className='bg-[#C3F3C0] border-dashed border-2 border-gray-400 rounded-2xl h-60 w-100 flex items-center justify-center flex-col'>
//                         <button
//                             onClick={() => document.getElementById("fileInput").click()}>
//                             <FaCamera size={50} color='green' className='cursor-pointer' />
//                         </button>
//                         {/* Hidden File Input */}
//                         <input id="fileInput" type="file"  accept="image/*"   onChange={handleInputChange}   />
//                         {/* Drag & Drop Zone */}
//                         <div  onDrop={handleDrop} onDragOver={handleDragOver}  className='mt-5 text-xl text-gray-700 cursor-pointer' >
//                             Upload or Drag image Here
//                         </div>
//                         {/* Preview */}
//                         {preview && (
//                             <img  src={preview}   alt="preview"  className='max-w-xl mt-2.5'   />
//                         )}



//                     </div>
//                     <div className='bg-[#C3F3C0] pt-10 rounded-2xl text-center h-70 w-200 mt-5'>
//                         <p className=' text-xl text-gray-600 ' >Upload Now to get the prediction</p>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )

// }


// export default Classification



import React, { useState } from 'react';
import { FaCamera } from "react-icons/fa";
import Navbar from '../Components/Navbar';

function Classification() {
    const [preview, setPreview] = useState(null);

    const handleFile = (file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <Navbar />
            <section className='flex flex-col items-center justify-center py-10 leading-1.5 gap-10'>
                <p className='text-3xl text-gray-600 font-semibold leading-1.5'>Dispose Smartly</p>
                <p className='text-2xl text-gray-700 text-center max-w-4xl'>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore eveniet, impedit officiis neque autem expedita explicabo sequi ex repellat eum?
                </p>

                <div className='flex mt-10 flex-col items-center'>
                    {/* Upload Box */}
                    <div className='bg-[#C3F3C0] border-dashed border-2 border-gray-400 rounded-2xl h-65 w-120 flex items-center justify-center flex-col'>
                    <div
                        className='bg-[#C3F3C0]  rounded-2xl h-60 w-100 flex items-center justify-center flex-col relative overflow-hidden'
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}>
                        {/* Camera Icon (hidden after upload) */}
                        {!preview && (
                            <button
                                onClick={() => document.getElementById("fileInput").click()}
                                className='absolute z-10'
                            >
                                <FaCamera size={50} color='green' className='cursor-pointer' />
                            </button>
                        )}

                        {/* Hidden File Input */}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleInputChange}
                            className='hidden'
                        />

                        {/* Upload Text (hidden after upload) */}
                        {/* {!preview && (
                            <div className='text-xl pt-20 text-gray-700 cursor-pointer'>
                                Upload or Drag image Here
                            </div>
                        )} */}

                        {/* Image Preview */}
                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className='w-full h-full object-contain'
                            />
                        )}
                    </div>
                     <div className='text-xl pb-2 text-gray-700 cursor-pointer'>
                                Upload or Drag image Here
                            </div>
                    </div>

                    {/* Prediction Prompt */}
                    <div className='bg-[#C3F3C0] pt-10 rounded-2xl text-center h-70 w-200 mt-5'>
                        <p className=' text-xl text-gray-600 ' >Upload Now to get the prediction</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Classification;