"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useUser } from "@/utils/UserProvider";

const Register = () => {
  const { loginUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/v1/users/register", {
        username,
        password,
      });
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      loginUser(userData);
      setIsLoading(false);
      Swal.fire({
        title: "Register Berhasil",
        icon: "success",
      });
      router.push("/");
    } catch (error) {
      Swal.fire({
        title: "Register Gagal",
        text: error.response.data.error,
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-4/5 md:w-3/5 min-h-screen mx-auto  grid place-items-center">
      <div className="w-full flex h-3/4 bg-white p-4 gap-6">
        <Image
          src={"/BgImage.png"}
          width={200}
          height={400}
          alt="Login form"
          className="w-1/2 h-full object-cover hidden md:block"
        />

        <div className="p-2">
          <h1 className="text-3xl font-bold text-center p-5">Register Forms</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 outline-none border-2 my-3"
            placeholder="Username"
            name="username"
            autoComplete="true"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 outline-none border-2 my-3"
            placeholder="Password"
            name="password"
            autoComplete="true"
          />

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="bg-slate-800 w-full my-3 p-3 text-white font-bold"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
          <p className="my-12">
            Sudah memiliki akun?
            <span>
              <Link
                href={"/login"}
                className="text-blue-700 hover:text-blue-800"
              >
                {" "}
                Login disini
              </Link>
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
