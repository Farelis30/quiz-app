import Login from "@/components/Login";
import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="w-full relative">
      <Image
        src="/BgImage.png"
        alt="BG Image"
        fill
        sizes="(max-width: 1920px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        className="w-full min-h-screen absolute -z-10 object-cover object-right blur-sm"
      />
      <Login />
    </div>
  );
};

export default page;
