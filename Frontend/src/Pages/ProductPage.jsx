import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCartOutlined } from "@mui/icons-material";
import ImageSlider from "../Components/ImageSlider";
import Navbar from "../Components/Navbar.jsx";

const ProductPage = () => {
    const [product, setProduct] = useState({}); 
  const { id } = useParams();
  const location = useLocation();
  const productId = id || location.state?.productId; 
  const [seller, setSeller] = useState({});
  const [showPopup, setShowPopup] = useState(false); 

   useEffect(() => {
    const getProduct = async () => {
      if (!productId) return;
      try {
        const response = await axios.get(`http://localhost:8000/api/product/${productId}`);
        if (response.data.product && response.data.product.length > 0) {
          setProduct(response.data.product[0]);
          console.log("Fetched Product:", response.data.product[0]);
        }
      } catch (error) {
        console.log("Error fetching product:", error);
      }
    };
    getProduct();
  }, [productId]);

  // Seller info is now fetched from profiles API or shown from product data
  useEffect(() => {
    if (product.seller_id) {
      setSeller({ 
        address: "Seller ID: " + product.seller_id,
        contact: "Contact seller for details"
      });
    }
  }, [product.seller_id]);
  
   const handleBuyNow = async (p_id, seller_id) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/order/${p_id}`,
        { seller_id },
        { withCredentials: true }
      );
      console.log("Order Response:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setShowPopup(true);
      }
      console.log("Error placing order:", error);
    }
  };

  // Ensure images are parsed properly - handle both string JSON and array from database
  let images = [];
  try {
    if (product.image) {
      if (typeof product.image === 'string') {
        images = JSON.parse(product.image);
      } else if (Array.isArray(product.image)) {
        images = product.image;
      }
      images = images.filter(img => typeof img === 'string' && img.trim() !== '');
    }
  } catch (error) {
    console.error("Error parsing images:", error);
    images = [];
  }

  return (
    <>
      <Navbar />
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-[350px] text-center relative">
            <button onClick={() => setShowPopup(false)} className="absolute top-3 right-4 text-xl">×</button>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Login Required</h2>
            <p className="text-gray-600">Please login to continue.</p>
          </div>
        </div>
      )}
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* TOP SECTION */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT – IMAGE SLIDER */}
            <div className="lg:w-2/3">
              <ImageSlider images={images} />
            </div>

            {/* RIGHT – PRODUCT INFO */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded shadow sticky top-6">
                <span className="text-xs text-green-600 font-semibold">
                  {product.category || "PRODUCT"} • {product.used_duration || "N/A"}
                </span>

                <h1 className="text-xl font-bold mt-1">
                  {product.p_name}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  {seller.address || seller.city || "Seller location not available"} • Posted {product.posting_date || "Recently"}
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-4">
                  Rs. {product.price || "0.00"}
                </p>

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-teal-500 text-white py-2 rounded font-semibold">
                    CALL
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded font-semibold">
                    CHAT
                  </button>
                </div>

                <div className="grid grid-cols-3 text-center text-sm text-gray-600 mt-6">
                  <p>Get all details</p>
                  <p>Schedule a visit</p>
                  <p>Negotiate price</p>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="bg-white mt-8 rounded shadow p-6">
            <div className="flex border-b mb-6">
              <button className="border-b-2 border-blue-600 pb-2 text-blue-600 font-medium">
                Ad Details
              </button>
              <button className="ml-6 text-gray-500">
                Description
              </button>
            </div>

            {/* AD DETAILS */}
            <h2 className="text-lg font-semibold mb-4">Ad Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-gray-500">Ad ID</p>
                <p className="font-medium">{product.id || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Condition</p>
                <p className="font-medium">{product.used_duration || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{product.category || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-500">Negotiable</p>
                <p className="font-medium">{product.negotiable || "No"}</p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">
                Description
              </h2>
              <p className="text-gray-600">
                {product.p_desc || "No description available"}
              </p>
            </div>
            <div className="flex flex-row">
              <button
                className="w-[20vw] h-11 mr-4 mb-6 cursor-pointer"
                style={{
                  borderWidth: "4px",
                  borderRadius: "12px",
                  borderImageSlice: "1",
                  borderImageSource:
                    "linear-gradient(90deg, rgba(11,205,220,1) 0%, rgba(44,108,223,1) 100%)",
                }}
              >
                <ShoppingCartOutlined /> Add to cart
              </button>
              <Link to={`/payment/${product.id}/${product.seller_id}`}>
                <button 
                  className="w-[20vw] h-11 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold cursor-pointer"
                  onClick={(e) => {
                    handleBuyNow(product.id, product.seller_id);
                  }}
                >
                  Buy Now
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductPage;