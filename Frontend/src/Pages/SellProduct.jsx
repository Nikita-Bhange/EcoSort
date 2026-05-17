
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

const SellProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const postId = location.state?.PostId || 0;

  // ================= FORM STATES =================

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Clothes");
  const [usedDuration, setUsedDuration] = useState("None");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState("No");
  const [images, setImages] = useState([]);

  // ================= OTHER STATES =================

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userProducts, setUserProducts] = useState([]);


  // ================= FETCH USER PRODUCTS =================

  const fetchUserProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/post",
        {
          withCredentials: true,
        }
      );

      setUserProducts(response.data.posts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  // ================= FETCH PRODUCT FOR EDIT =================

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/product/${postId}`
      );

      const data = response.data.product[0];

      setTitle(data.p_name || "");
      setDesc(data.p_desc || "");
      setCategory(data.category || "Clothes");
      setUsedDuration(data.used_duration || "None");
      setPrice(data.price || "");
      setNegotiable(data.negotiable || "No");

      setImages(data.image ? JSON.parse(data.image) : []);

    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };


  // ================= USE EFFECT =================

  useEffect(() => {
    fetchUserProducts();

    if (postId) {
      fetchProductDetails();
    }
  }, [postId]);


  // ================= IMAGE HANDLING =================

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const validFiles = files.filter(
      (file) => file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      alert("Some images exceeded 5MB size limit");
    }

    setImages((prev) => [...prev, ...validFiles]);
  };


  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };


  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !desc ||
      !category ||
      !usedDuration ||
      !price ||
      images.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("p_name", title);
      formData.append("p_desc", desc);
      formData.append("category", category);
      formData.append("used_duration", usedDuration);
      formData.append("price", price);
      formData.append("negotiable", negotiable);

      images.forEach((image) => {
        if (typeof image !== "string") {
          formData.append("image", image);
        }
      });


      // ================= ADD PRODUCT =================

      if (postId === 0) {
        await axios.post(
          "http://localhost:8000/api/post",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        alert("Product posted successfully!");
      }


      // ================= UPDATE PRODUCT =================

      else {
        await axios.put(
          `http://localhost:8000/api/post/update/${postId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        alert("Product updated successfully!");
      }

      fetchUserProducts();
      navigate("/home");

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setShowPopup(true);
      }

      alert("Something went wrong");

    } finally {
      setLoading(false);
    }
  };


  // ================= DELETE PRODUCT =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/post/${id}`,
        {
          withCredentials: true,
        }
      );

      alert("Product deleted successfully");

      fetchUserProducts();

    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };


  // ================= DESIGN CLASS =================

  const inputClass =
    "w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500";


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 px-4">

        {/* LOGIN POPUP */}

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl w-[350px] text-center relative">

              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-4 text-xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-red-500 mb-4">
                Login Required
              </h2>

              <p className="text-gray-600">
                Please login to continue.
              </p>
            </div>
          </div>
        )}


        {/* PAGE TITLE */}

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">
            {postId === 0 ? "Sell Your Product" : "Update Product"}
          </h1>


          {/* MAIN GRID */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


            {/* FORM SECTION */}

            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* TITLE */}

                <div>
                  <label className="font-semibold text-gray-700">
                    Product Title
                  </label>

                  <input
                    type="text"
                    placeholder="Enter product title"
                    className={inputClass}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>


                {/* CATEGORY */}

                <div>
                  <label className="font-semibold text-gray-700">
                    Category
                  </label>

                  <select
                    className={inputClass}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {[
                      "Clothes",
                      "Cars",
                      "Mobiles",
                      "Books",
                      "Pets",
                      "Appliances",
                      "Toys",
                      "Bikes",
                      "Furniture",
                    ].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>


                {/* USED DURATION */}

                <div>
                  <label className="font-semibold text-gray-700">
                    Used Duration
                  </label>

                  <select
                    className={inputClass}
                    value={usedDuration}
                    onChange={(e) => setUsedDuration(e.target.value)}
                  >
                    {[
                      "None",
                      "Less than 6 Months",
                      "6 Months - 1 Year",
                      "1 Year - 2 Years",
                      "2 Years - 4 Years",
                      "More than 4 Years",
                    ].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>


                {/* PRICE + NEGOTIABLE */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="font-semibold text-gray-700">
                      Price
                    </label>

                    <input
                      type="number"
                      placeholder="Enter product price"
                      className={inputClass}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>


                  <div>
                    <label className="font-semibold text-gray-700">
                      Negotiable
                    </label>

                    <select
                      className={inputClass}
                      value={negotiable}
                      onChange={(e) => setNegotiable(e.target.value)}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>


                {/* DESCRIPTION */}

                <div>
                  <label className="font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    placeholder="Write product details"
                    className={inputClass}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>


                {/* IMAGE UPLOAD */}

                <div>
                  <label className="font-semibold text-gray-700 block mb-3">
                    Upload Images
                  </label>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-dashed border-blue-400 rounded-xl p-4 bg-blue-50"
                  />
                </div>


                {/* IMAGE PREVIEW */}

                <div className="flex flex-wrap gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative"
                    >
                      <img
                        src={
                          typeof image === "string"
                            ? `http://localhost:8000/uploads/${image}`
                            : URL.createObjectURL(image)
                        }
                        alt="preview"
                        className="w-28 h-28 rounded-xl object-cover border"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>


                {/* SUBMIT BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:scale-[1.01] transition-all"
                >
                  {loading
                    ? "Processing..."
                    : postId === 0
                    ? "Post Product"
                    : "Update Product"}
                </button>
              </form>
            </div>


            {/* SIDEBAR */}

            <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">

              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Your Products
              </h2>


              {userProducts.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No products posted yet.
                </p>
              ) : (
                <div className="space-y-5">

                  {userProducts.map((product) => {
                    let images = [];
                    try {
                      if (product.image) {
                        // Handle both string JSON and array cases
                        if (typeof product.image === 'string') {
                          if (product.image !== "" && product.image !== "[]") {
                            images = JSON.parse(product.image);
                          }
                        } else if (Array.isArray(product.image)) {
                          // Already an array (from database)
                          images = product.image;
                        }
                        // Filter out any non-string values
                        images = images.filter(img => typeof img === 'string' && img.trim() !== '');
                      }
                    } catch (error) {
                      console.error("Error parsing images for product", product.id, ":", error, "Raw data:", product.image);
                      images = [];
                    }

                    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

                    return (
                      <div
                        key={product.id}
                        className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                      >

                        <img
                          src={images.length > 0 
                            ? `http://localhost:8000/uploads/${images[0]}`
                            : fallbackImage
                          }
                          alt="product"
                          className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-800">
                            {product.p_name}
                          </h3>

                          <div className="flex justify-between items-center mt-3">
                            <p className="font-semibold text-blue-700 text-lg">
                              ₹ {product.price}
                            </p>

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                product.negotiable === "Yes"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.negotiable === "Yes"
                                ? "Negotiable"
                                : "Fixed"}
                            </span>
                          </div>

                          <div className="flex gap-3 mt-5">

                            <button
                              onClick={() =>
                                navigate("/sellproduct", {
                                  state: {
                                    PostId: product.id,
                                  },
                                })
                              }
                              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                              Edit
                            </button>


                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SellProduct;


// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Footer from "../Components/Footer.jsx"
// import Navbar from "../Components/Navbar.jsx"
// import axios from "axios";

// const SellProduct = () => {
  
//   const [category, setCategory] = useState("Clothes");
//   const [images, setImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const PostId = location.state?.PostId || 0;
//   const [showPopup, setShowPopup] = useState(false); 
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [used_duration, setUsed_duration] = useState("None");
//   const [price, setPrice] = useState("");
//   const popupRef = useRef(null);

//   useEffect(() => {
//     if (PostId) {
//       handlePostChange();
//     }
//   }, [PostId]);

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);

//     if (images.length + files.length > 5) {
//       alert("You can upload a maximum of 5 images.");
//       return;
//     }

//     const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
//     if (validFiles.length !== files.length) {
//       alert("Some files exceed the 5MB size limit and were not uploaded.");
//     }

//     setImages((prevImages) => [...prevImages, ...validFiles]);
//   };

//   const removeImage = (index) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !desc || !used_duration || !category || !price || images.length === 0) {
//       alert("Please fill out all required fields and upload at least one image.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("p_name", title);
//     formData.append("p_desc", desc);
//     formData.append("used_duration", used_duration);
//     formData.append("category", category);
//     formData.append("price", price);

//     images.forEach((image) => {
//       if (typeof image !== "string") {
//         formData.append("image", image);
//       }
//     });


//     try {
//       if (PostId === 0) {
//         const response = await axios.post(
//           "http://localhost:3300/api/post",
//           formData,
//           { withCredentials: true }
//         );
//         // console.log(response.data);
//         alert("Product has been posted successfully!");
//       } else {
//         console.log("Post ID:", PostId);
    
       
    
//         const response = await axios.put(
//           `http://localhost:3300/api/post/update/${PostId}/`,
//           formData,
//           {
//             headers: { "Content-Type": "multipart/form-data" },
//             withCredentials: true,
//           }
//         );
    
//         alert("Post has been updated successfully!");
//       }
//       navigate("/home");
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setShowPopup(true); // Show popup if user is not logged in
//       }
//       console.error("Error adding/updating product:", error);
//       if (error.response) {
//         console.error("Response Data:", error.response.data);
//         console.error("Response Status:", error.response.status);
//       }
//     }
    
//   };

//   const handlePostChange = async () => {
//     if (!PostId) return;
  
//     try {
//       const response = await axios.get(`http://localhost:3300/api/product/${PostId}`);
//       const data = response.data.product[0];
  
//       console.log("Fetched Post Data:", data); // Debugging
  
//       setTitle(data.p_name || "");  // Ensure key names match backend response
//       setDesc(data.p_desc || "");
//       setUsed_duration(data.used_duration || "None");
//       setCategory(data.category || "Mobile");
//       setPrice(data.price || "");
  
//       // Handle images properly (if stored as JSON string)
//       setImages(data.image ? JSON.parse(data.image) : []);
//     } catch (error) {
//       console.error("Error fetching post:", error);
//     }
//   };
  


//   const on_Hover = "hover:border-2 border-solid border-slate-300";

//   return (
//     <>
//       <Navbar/>
     
//       <div className="flex flex-col items-center font-sans bg-slate-100 py-3"> 
//       {showPopup && (
//         <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50">
//           <div className="relative bg-red-400 text-center text-white p-6 rounded-lg shadow-lg w-96">
//             {/* Close Button in Upper Right Corner */}
//             <button
//               className="absolute top-2 right-2 text-white text-xl font-bold bg-transparent hover:text-gray-200"
//               onClick={() => setShowPopup(false)}
//             >
//               &times;
//             </button>

//             <p className="mb-4">You are not logged in. Please log in to continue.</p>
//           </div>
//         </div>
//       )}
//         <h1 className="text-2xl font-semibold mt-0 mb-6 pt-12 text-blue-900">
//           POST YOUR PRODUCT
//         </h1>

//         <div className="items-start w-11/12 rounded-lg shadow-lg bg-gradient-to-r from-cyan-400 to-blue-500 md:p-[3px] overflow-hidden">
//           <div className="flex flex-col items-start pl-9 pt-14 justify-start w-full rounded-lg bg-white overflow-hidden">
//             <form
//               className="flex flex-col items-start pl-9 pt-14 justify-start w-11/12 rounded-lg bg-white"
//               onSubmit={handleSubmit}
             
//             >
//               <label htmlFor="title">Title*</label>
//               <input
//                 id="title"
//                 type="text"
//                 className="bg-[#eaecee] rounded-lg h-14 w-1/2 px-2 hover:border-slate-300 hover:border-2 hover:border-solid"
//                 placeholder="Enter item title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//               <label htmlFor="category" className="mt-7">Category</label>
//               <select
//                 id="category"
//                 className={`${on_Hover} bg-[#eaecee] mb-7 w-1/2 h-14 rounded-xl`}
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 {[
//                   "Clothes",
//                   "Cars",
//                   "Mobiles",
//                   "Books",
//                   "Pets",
//                   "Appliances",
//                   "Toys",
//                   "Bikes",
//                   "Furniture",
//                 ].map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>

//               <label htmlFor="used-duration">Used Duration</label>
//               <select
//                 id="used-duration"
//                 className={`${on_Hover} bg-[#eaecee] mb-7 w-1/2 h-14 rounded-xl`}
//                 value={used_duration}
//                 onChange={(e) => setUsed_duration(e.target.value)}
//               >
//                 {[
//                   "None",
//                   "Less than 6 Months",
//                   "6 Months - 1 Year",
//                   "1 Year - 2 Years",
//                   "2 Years - 4 Years",
//                   "More than 4 Years",
//                 ].map((duration) => (
//                   <option key={duration} value={duration}>
//                     {duration}
//                   </option>
//                 ))}
//               </select>

//               <label htmlFor="price">Price</label>
//               <input
//                 id="price"
//                 type="text"
//                 className="mb-7 bg-[#eaecee] rounded-lg h-14 w-1/2 hover:border-slate-300 hover:border-2 hover:border-solid px-2"
//                 placeholder="Enter price"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />

//               <label htmlFor="description">Description</label>
//               <textarea
//                 id="description"
//                 cols={50}
//                 rows={5}
//                 className="bg-[#eaecee] rounded-xl p-2"
//                 placeholder="Include condition, features, and reason for selling px-2"
//                 value={desc}
//                 onChange={(e) => setDesc(e.target.value)}
//               ></textarea>

//               <input
//                 type="file"
//                 id="file"
//                 name="file"
//                 className="block w-fit text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 p-3 my-8 "
//                 multiple
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />

//               <div className="flex flex-wrap gap-3 my-4 ">
//                 {images.map((image, index) => (
//                   <div key={index} className="relative">
//                     <img
//                         src={
//                           PostId === 0
//                             ? typeof image === "string"
//                               ? image
//                               : URL.createObjectURL(image)
//                             : typeof image === "string"
//                             ? `http://localhost:3300/uploads/${image}`
//                             : URL.createObjectURL(image)
//                         }
//                         className="w-28 h-28 rounded-lg border"
//                         alt="Preview"
//                       />

//                     <button
//                       onClick={() => removeImage(index)}
//                       className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs "
//                     >
//                       X
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               <button type="submit" disabled={isLoading} className={`${on_Hover} scroll-auto bg-gradient-to-r from-cyan-400 to-blue-500 md:p-[3px] overflow-hidden w-40 h-11 mb-9 rounded-lg font-semibold cursor-pointer text-white`}>
//                 {PostId === 0 ? "POST" : "UPDATE POST"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default SellProduct;
