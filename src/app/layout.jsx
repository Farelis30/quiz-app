import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/utils/UserProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kuis Tebak Gambar",
  description: "Game yang mengasah visual anda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`${inter.className}`}>{children}</body>
      </UserProvider>
    </html>
  );
}
