import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Water Pollution Reporter",
  description: "Report and track pollution incidents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Toaster position="top-right" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
