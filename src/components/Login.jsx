"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useUser } from "@/utils/UserProvider";

const Login = () => {
  const { loginUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/v1/users/login", {
        username,
        password,
      });
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      loginUser(userData);
      // Redirect to home or any other page after successful login
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      Swal.fire({
        title: "Login Gagal",
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
          <h1 className="text-3xl font-bold text-center p-5">Login Forms</h1>
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
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-slate-800 w-full my-3 p-3 text-white font-bold"
          >
            {isLoading ? (
              <span className="loading loading-bars loading-md"></span>
            ) : (
              "Login"
            )}
          </button>
          <p className="my-12">
            Belum punya akun?
            <span>
              <Link
                href={"/register"}
                className="text-blue-700 hover:text-blue-800"
              >
                {" "}
                Buat disini
              </Link>
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
