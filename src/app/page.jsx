"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/utils/UserProvider";
import { AiOutlineMore } from "react-icons/ai";

const Home = () => {
  const { user, logoutUser } = useUser();

  return (
    <div className="w-full relative">
      <div className="navbar px-10 bg-base-100">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost text-xl">
            Tebak Gambar
          </Link>
        </div>
        <div className="flex-none">
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
        <h1 className="text-5xl text-white font-bold">
          Cerdas dalam Tantangan <br /> Kreatif dalam Tebakan
        </h1>
        <h2 className="mt-10 mb-16 text-base font-light text-white">
          Tantang Temanmu Siapa yang Lebih Cepat <br /> Dalam Menebak Gambar !!!
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
