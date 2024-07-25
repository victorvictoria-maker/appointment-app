import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import ClientLayout from "../components/ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Appointment App",
  description: "Book appointments with your HOD",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        <ClientLayout>
          <main>{children}</main>
        </ClientLayout>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
