import React, { useEffect, useState } from "react";
import Image from "next/image";
import Nyawa from "./GuessNyawa";
import { IoIosArrowBack } from "react-icons/io";
import { MdLeaderboard } from "react-icons/md";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@/utils/UserProvider";
import axios from "axios";
import Swal from "sweetalert2";

const LevelSelector = ({
  onSelectLevel,
  jumlahNyawa,
  cooldown,
  setCooldown,
  handleNyawaRecovered,
  onNyawaRecovered,
}) => {
  const levels = [1, 2, 3, 4, 5, 6, 7];
  const { user } = useUser();
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  useEffect(() => {
    let interval;

    if (isCooldownActive && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (cooldownTime === 0) {
      setIsCooldownActive(false);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isCooldownActive, cooldownTime]);

  const handleRecoverNyawa = async () => {
    try {
      if (jumlahNyawa < 3 && !isCooldownActive) {
        setIsCooldownActive(true);
        setCooldownTime(30); // Set the cooldown time in seconds
        Swal.fire({
          title: "Pemulihan Nyawa Digunakan",
          text: "Nyawa Anda akan pulih dalam 30 detik!",
          icon: "success",
        });

        const response = await axios.put(
          "/api/v1/users",
          {
            newScore: user.score,
            newLives: jumlahNyawa + 1,
            newHint: user.hint,
            newCompletedLevel: user.completedLevel,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setTimeout(() => {
          setIsCooldownActive(false);
          onNyawaRecovered();
        }, 30000); // 60 seconds cooldown
      } else if (jumlahNyawa === 3) {
        Swal.fire({
          title: "Nyawa Penuh",
          text: "Nyawa Anda Sudah Penuh",
          icon: "warning",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat mengupdate nyawa.",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center">
      <motion.div
        className="bg-white w-full h-screen absolute top-0 z-50"
        initial={{ opacity: 1, x: 0 }}
        animate={{
          opacity: 0.5,
          x: "-100%",
          transitionEnd: { display: "none" },
        }}
        transition={{ duration: 0.7 }}
      ></motion.div>
      <div className="w-full h-screen absolute top-0 left-0 bg-black/10 z-10"></div>
      <Link
        href={"/"}
        aria-label="Back to homepage"
        className="w-14 h-14 absolute top-4 left-4 bg-[#20324E] text-white rounded-full flex place-items-center justify-center border-4 border-white z-20 hover:scale-110"
      >
        <IoIosArrowBack size={30} />
      </Link>
      <Image
        src="/TebakGambar.png"
        alt="BG Image"
        width={1000}
        height={800}
        priority
        className="w-full h-screen absolute object-cover object-top"
      />

      <div className="w-4/5 md:w-1/2 z-40 pt-12">
        <div className="my-4 md:my-8 flex justify-between items-center text-white">
          <h2 className="text-2xl text-white font-bold text-center">
            Select Level Game
          </h2>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white hidden md:block">
              Score: {user && user.score}
            </h2>
            <Link
              href={"/leaderboard"}
              onClick={() => {
                const audio = new Audio("/sound/leaderboard.mp3");
                audio.play();
              }}
              aria-label="go to leaderboard"
            >
              <MdLeaderboard size={30} />
            </Link>
          </div>
        </div>
        <div className="w-full flex justify-end my-4 md:hidden">
          <h2 className="text-base font-bold text-white">
            Score: {user && user.score}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full h-96 md:h-72 overflow-y-scroll">
          {levels.map((level, index) => (
            <motion.button
              whileHover={{ border: 0 }}
              whileTap={{ scale: 0.8 }}
              className="w-full bg-[#0D0C1D] border-4 border-white rounded text-white py-3 flex flex-col items-center"
              key={index}
              onClick={() => {
                onSelectLevel(level);
              }}
            >
              <h1 className="mb-3 font-bold text-2xl">Level</h1>
              <h2 className="font-bold text-3xl">{index + 1}</h2>
            </motion.button>
          ))}
        </div>
        {user && (
          <div className="mt-4 flex justify-between  py-4 rounded">
            <div className="text-white text-xl font-bold bg-orange-600 p-3 rounded flex items-center">
              Hint : {user.hint}
            </div>
            <div className="text-white p-3 text-xl font-bold flex items-center gap-2 bg-slate-100 rounded relative">
              <Nyawa
                jumlahNyawa={user.lives}
                onNyawaRecovered={handleNyawaRecovered}
                cooldown={cooldown}
                setCooldown={setCooldown}
              />
              {user.lives < 3 && (
                <>
                  {isCooldownActive ? (
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-white rounded-full bg-green-500"
                      onClick={handleRecoverNyawa}
                    >
                      {cooldownTime}s
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white w-10 h-10 bg-green-500 rounded-full absolute -bottom-4 -right-4"
                      onClick={handleRecoverNyawa}
                    >
                      +
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelSelector;
