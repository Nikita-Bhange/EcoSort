import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Check, MapPin } from "lucide-react";
import axios from "axios";

const ProductCard = ({ items }) => {
  const [added, setAdded] = useState(false);

  const handleCart = async (e, p_id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/cart/add/${p_id}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (error) {
      console.error("Cart error:", error);
      if (error.response?.status === 401) {
        alert("Please login to add items to cart");
      } else if (error.response?.status === 400) {
        alert("Product already in cart");
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    }
  };

  // Parse images - handle both string JSON and array from database
  let images = [];
  try {
    if (items.image) {
      if (typeof items.image === "string") {
        if (items.image !== "" && items.image !== "[]") {
          images = JSON.parse(items.image);
        }
      } else if (Array.isArray(items.image)) {
        images = items.image;
      }
      images = images.filter((img) => typeof img === "string" && img.trim() !== "");
    }
  } catch (error) {
    console.error("Error parsing images:", error);
    images = [];
  }

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="w-[260px] rounded-2xl bg-white shadow-lg p-4 relative hover:shadow-xl transition-shadow">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/product/${items.id}`} state={{ productId: items.id }}>
          <img
            src={images.length > 0 ? `http://localhost:8000/uploads/${images[0]}` : fallbackImage}
            alt={items.p_name || "Product"}
            className="w-full h-44 object-cover rounded-xl"
          />
        </Link>

        {/* Heart Icon - Top Right */}
        <button className="absolute right-2 top-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition">
          <Heart size={16} className="text-gray-600" />
        </button>

        {/* Negotiable/Fixed Badge - Bottom Left */}
        <span className={`absolute left-2 bottom-2 px-2 py-1 text-white text-xs font-medium rounded-full ${
          items.negotiable === "Yes" ? "bg-green-500" : "bg-red-500"
        }`}>
          {items.negotiable === "Yes" ? "Negotiable" : "Fixed"}
        </span>
      </div>

      {/* Product Info */}
      <div className="mt-3">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 truncate">{items.p_name}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-gray-500">
          <MapPin size={14} />
          <span className="text-xs truncate">
            {[items.seller_city, items.seller_state].filter(Boolean).join(", ") || items.category || "Location"}
          </span>
        </div>

        {/* Price and Cart Button */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-xl font-bold text-gray-900">₹ {items.price}</p>

          <button
            className={`p-2 rounded-xl transition ${
              added ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={(e) => handleCart(e, items.id)}
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;