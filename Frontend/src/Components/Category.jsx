import React from "react";
import { useNavigate } from "react-router-dom";

import CategoriesApi from "../ComponentApi/CategoriesApi.js";
const Categories = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="pt-[6rem] text-center pb-[2rem]">
        <p className="text-4xl" id="categories">
          <span className="font-bold text-amber-950">Explore</span>
          <span className="text-amber-900 font-bold"> Categories </span>
        </p>
      </div>

     <div className="h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 px-3 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
  {CategoriesApi.map((item) => {
    const Icon = item.icon;

    return (
      <div
        key={item.title}
        className="m-2 shadow-lg rounded-lg  flex flex-col items-center justify-center gap-3 p-6 cursor-pointer hover:scale-105 transition"
        onClick={() =>
          navigate(`/category/${item.title}`, {
            state: { name: item.title },
          })
        }
      >
        {/* Icon container */}
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
          <Icon
            sx={{
              fontSize: 38, 
            }}
          />
        </div>

        <h2 className="text-gray-800 font-medium text-xl">
          {item.title}
        </h2>
      </div>
    );
  })}
</div>

    </>
  );
};

export default Categories;
