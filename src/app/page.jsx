"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/utils/UserProvider";
import { AiOutlineMore } from "react-icons/ai";
import { motion } from "framer-motion";

const Home = () => {
  const { user, logoutUser } = useUser();

  return (
    <div className="w-full relative">
      <motion.div
        className="bg-white w-0 h-screen absolute top-0 z-10"
        initial={{ opacity: 1, x: "40%", width: "100%" }}
        animate={{
          opacity: 0,
          x: "100%",
          width: 0,
          transitionEnd: { display: "none" },
        }}
        transition={{ duration: 1.2 }}
      ></motion.div>

      <motion.div
        className="bg-white w-0 h-screen absolute top-0 z-10"
        initial={{ opacity: 1, x: "-40%", width: "100%" }}
        animate={{
          opacity: 0,
          x: "100%",
          width: 0,
          transitionEnd: { display: "none" },
        }}
        transition={{ duration: 1.2 }}
      ></motion.div>
      <div className={user ? "navbar px-10 bg-base-100" : "hidden"}>
        <div className="flex-none md:flex-1">
          <Link href={"/"} className="btn btn-ghost text-xl hidden md:flex">
            Tebak Gambar
          </Link>
        </div>
        <div className="flex md:flex-none justify-between w-full md:w-auto">
          {user && (
            <div>
              Selamat Datang <span className="font-bold">{user.username}</span>
            </div>
          )}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar grid place-items-center"
            >
              <div className="bg-slate-200 p-2 rounded-full">
                <AiOutlineMore size={20} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {!user && (
                <li>
                  <Link href={"/register"} className="justify-between">
                    Register
                  </Link>
                </li>
              )}
              <li>
                {user ? (
                  <a onClick={logoutUser}>Logout</a>
                ) : (
                  <Link href="/login">Login</Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Image
        src="/BgImage.png"
        alt="BG Image"
        fill
        sizes="(max-width: 1920px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        className="w-full min-h-screen absolute -z-10 object-cover object-left-top"
      />
      <div className="w-11/12 mx-auto py-28">
        <h1 className="text-4xl md:text-5xl text-white font-bold text-balance">
          Cerdas dalam Tantangan <br className="hidden md:block" /> Kreatif
          dalam Tebakan
        </h1>
        <h2 className="mt-10 mb-16 text-xl font-light text-white">
          Tantang Temanmu Siapa yang Lebih Cepat{" "}
          <br className="hidden md:block" />
          Dalam Menebak Gambar !!!
        </h2>
        <Link
          href={user ? "/guess" : "/login"}
          className="text-xl bg-[#FFBC42] px-8 py-2 font-bold cursor-pointer hover:bg-[#ffcb69] duration-300"
        >
          Let's Play
        </Link>
      </div>
    </div>
  );
};

export default Home;
