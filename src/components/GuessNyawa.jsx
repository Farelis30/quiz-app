"use client";
import React from "react";
import { FaHeart } from "react-icons/fa";

const Nyawa = ({ jumlahNyawa }) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        {[...Array(jumlahNyawa)].map((_, index) => (
          <FaHeart key={index} size={24} color="red" />
        ))}
      </div>
    </>
  );
};

export default Nyawa;
