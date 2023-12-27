"use client";
import GuessContent from "@/components/GuessContent";
import { useUser } from "@/utils/UserProvider";
import { useRouter } from "next/navigation";
import React from "react";

const Guess = () => {
  // const { user } = useUser();
  // const router = useRouter();
  // if (!user) {
  //   router.push("/login");
  // }
  const linearGradientStyle = {
    background: "linear-gradient(to right top, #7844C7, #B787FF)",
  };

  return (
    <div
      className="w-full h-screen flex justify-center place-items-center relative"
      style={linearGradientStyle}
    >
      <GuessContent />
    </div>
  );
};

export default Guess;
