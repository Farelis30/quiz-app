"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/utils/UserProvider";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/users/leaderboard");
        const data = await response.json();
        setLeaderboardData(data);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setIsLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      const updatedData = [...leaderboardData];
      const randomIndex = Math.floor(Math.random() * leaderboardData.length);
      updatedData[randomIndex].score += Math.floor(Math.random() * 50) + 1;
      setLeaderboardData(updatedData);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [leaderboardData]);

  const linearGradientStyle = {
    background: "linear-gradient(to right top, #7844C7, #B787FF)",
  };

  let updatedUser;
  if (!isLoading) {
    updatedUser = leaderboardData.find(
      (value) => user.username === value.username
    );
  }
  return (
    <div style={linearGradientStyle} className="min-h-screen relative">
      <div className="w-11/12 h-screen md:max-w-md mx-auto py-8 flex flex-col justify-center">
        <h1 className="text-3xl text-white font-semibold mb-4">Leaderboard</h1>
        <div className="h-96 overflow-y-auto">
          <AnimatePresence>
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              <>
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="animate-pulse flex items-center justify-between bg-gray-200 p-4 rounded-md shadow-md mb-4"
                  >
                    <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                    <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </>
            ) : (
              leaderboardData.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-between bg-gray-200 p-4 rounded-md shadow-md mb-4"
                >
                  <span className="text-lg font-semibold">
                    {value.position}
                  </span>
                  <span className="text-lg">{value.username}</span>
                  <span className="text-lg font-semibold">{value.score}</span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        {isLoading ? (
          <>
            {
              <div className="animate-pulse flex items-center justify-between bg-gray-200 p-4 rounded-md shadow-md mb-4">
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
            }
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between bg-purple-800 text-white p-4 rounded-md shadow-md mb-4"
            >
              <span className="text-xl font-semibold">Your Position</span>
              <span className="text-lg font-bold">
                {user ? updatedUser.username : ""}
              </span>
              <span className="text-lg font-semibold">
                {user ? updatedUser.position : ""}
              </span>
            </motion.div>
            <Link
              href={"/guess"}
              className="w-full h-14 bg-[#20324E] text-white font-bold text-2xl rounded flex place-items-center border-4 border-white hover:scale-105 px-4"
            >
              <IoIosArrowBack size={30} className="block md:hidden" />
              <div className="w-full text-center">Kembali</div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
