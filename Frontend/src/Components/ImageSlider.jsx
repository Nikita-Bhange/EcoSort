import React, { useState } from "react";

const ImageSlider = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 rounded shadow w-full h-[420px] flex items-center justify-center text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow relative overflow-hidden h-[420px] flex items-center justify-center">
      <img
        src={`http://localhost:8000/uploads/${images[index]}`}
        alt="product"
        className="w-full h-full object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setIndex((index - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          >
            ←
          </button>
          <button
            onClick={() => setIndex((index + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
          >
            →
          </button>
        </>
      )}

      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {index + 1} / {images.length} IMAGES
      </div>
    </div>
  );
};

export default ImageSlider;
